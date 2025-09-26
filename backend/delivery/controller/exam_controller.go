package controller

import (
	"net/http"
	"strconv"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ExamController struct {
	ExamUsecase   usecases.ExamUseCase
	StorageUsecase usecases.StorageUseCase
}

func NewExamController(examUsecase usecases.ExamUseCase, storage usecases.StorageUseCase) *ExamController {
	return &ExamController{
		ExamUsecase:   examUsecase,
		StorageUsecase: storage,
	}
}

// GET /api/exams?page=1
func (ec *ExamController) GetExams(ctx *gin.Context) {
	userID, exist := ctx.Get("user_id")
	if !exist {
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		ctx.JSON(400, gin.H{"error": "Invalid User ID type"})
		return
	}
	userIDPrimitive, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid User ID format"})
		return
	}

	page := ctx.Query("page")
	if page == "" {
		ctx.JSON(400, gin.H{"error": "Page number is required"})
		return
	}
	pageInt, err := strconv.Atoi(page)
	if err != nil || pageInt < 1 {
		ctx.JSON(400, gin.H{"error": "Invalid page number"})
		return
	}

	exams, err := ec.ExamUsecase.GetExams(ctx, userIDPrimitive, pageInt)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to retrieve exams"})
		return
	}

	ctx.JSON(200, gin.H{
		"exams":   exams,
		"message": "Exams retrieved successfully",
	})
}

// GET /api/exams/:id
func (ec *ExamController) GetExamByID(ctx *gin.Context) {
	examID := ctx.Param("id")
	if examID == "" {
		ctx.JSON(400, gin.H{"error": "Exam ID is required"})
		return
	}

	examIDPrimitive, err := primitive.ObjectIDFromHex(examID)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Exam ID format"})
		return
	}

	exam, err := ec.ExamUsecase.GetExamByID(ctx, examIDPrimitive)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to retrieve exam"})
		return
	}

	ctx.JSON(200, gin.H{
		"exam":    exam,
		"message": "Exam retrieved successfully",
	})
}

// POST /api/exams
func (ec *ExamController) CreateExam(ctx *gin.Context) {
	userID, exist := ctx.Get("user_id")
	if !exist {
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		ctx.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}
	obId, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid user ID format"})
		return
	}

	ctx.Request.Body = http.MaxBytesReader(ctx.Writer, ctx.Request.Body, 20<<20) // 20 MB
	form, err := ctx.MultipartForm()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error":   "Failed to parse multipart form",
			"details": err.Error(),
		})
		return
	}

	var exam models.Exam

	// Department
	departmentID := form.Value["department_id"]
	if len(departmentID) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Department ID is required"})
		return
	}
	depId, err := primitive.ObjectIDFromHex(departmentID[0])
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Department ID format"})
		return
	}
	exam.DepartmentID = depId

	// Title
	title := form.Value["title"]
	if len(title) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Title is required"})
		return
	}
	exam.Title = title[0]

	// Year
	year := form.Value["year"]
	if len(year) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Year is required"})
		return
	}
	yearInt, err := strconv.Atoi(year[0])
	if err != nil || yearInt < 1 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Year must be a positive integer"})
		return
	}
	exam.Year = yearInt

	// Semester
	semester := form.Value["semester"]
	if len(semester) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Semester is required"})
		return
	}
	semesterInt, err := strconv.Atoi(semester[0])
	if err != nil || (semesterInt != 1 && semesterInt != 2) {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Semester must be either 1 or 2"})
		return
	}
	exam.Semester = semesterInt

	exam.UploadedBy = obId

	/////////////////////checkpoint----////

	// File validation
	files := form.File["file"]
	if len(files) == 0 {
		ctx.JSON(400, gin.H{"error": "You must upload a file"})
		return
	}
	for _, file := range files {
		if file.Header.Get("Content-Type") != "application/pdf" {
			ctx.JSON(400, gin.H{"error": "Only PDF files are allowed"})
			return
		}
	}

	// Upload file
	urls, err := ec.StorageUsecase.UploadFile(files)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to upload files", "details": err.Error()})
		return
	}
	exam.FileURL = urls[0]

	newExam, err := ec.ExamUsecase.CreateExam(ctx, exam)
	if err != nil {
		ec.StorageUsecase.DeleteFile(urls) // rollback
		ctx.JSON(500, gin.H{"error": "Failed to create exam"})
		return
	}

	ctx.JSON(201, gin.H{
		"message": "Exam created successfully",
		"exam":    newExam,
	})
}

// PUT /api/exams/:id
func (ec *ExamController) UpdateExam(ctx *gin.Context) {
	examID := ctx.Param("id")
	if examID == "" {
		ctx.JSON(400, gin.H{"error": "Exam ID is required"})
		return
	}

	var exam models.Exam
	if err := ctx.ShouldBindJSON(&exam); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid request body"})
		return
	}

	examIDPrimitive, err := primitive.ObjectIDFromHex(examID)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Exam ID format"})
		return
	}
	exam.ID = examIDPrimitive

	userID, exist := ctx.Get("user_id")
	if !exist {
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		ctx.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}
	userIDPrimitive, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid User ID format"})
		return
	}
	exam.UploadedBy = userIDPrimitive

	updatedExam, err := ec.ExamUsecase.UpdateExam(ctx, exam)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to update exam"})
		return
	}

	ctx.JSON(200, updatedExam)
}

// DELETE /api/exams/:id
func (ec *ExamController) DeleteExam(ctx *gin.Context) {
	examID := ctx.Param("id")
	if examID == "" {
		ctx.JSON(400, gin.H{"error": "Exam ID is required"})
		return
	}
	examIDPrimitive, err := primitive.ObjectIDFromHex(examID)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Exam ID format"})
		return
	}

	userID, exist := ctx.Get("user_id")
	if !exist {
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		ctx.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}
	userIDPrimitive, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid User ID format"})
		return
	}

	exam, err := ec.ExamUsecase.GetExamByID(ctx, examIDPrimitive)
	if err != nil {
		ctx.JSON(404, gin.H{"error": "Exam not found"})
		return
	}
	if exam.UploadedBy != userIDPrimitive {
		ctx.JSON(403, gin.H{"error": "You are not authorized to delete this exam"})
		return
	}

	err = ec.ExamUsecase.DeleteExam(ctx, userIDPrimitive, examIDPrimitive)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to delete exam"})
		return
	}

	ec.StorageUsecase.DeleteFile([]string{exam.FileURL})

	ctx.JSON(204, gin.H{
		"message": "Exam deleted successfully",
	})
}

// GET /api/exams/tree?department_id=...&year=1&semester=2
func (ec *ExamController) GetExamsInTree(ctx *gin.Context) {
	departmentID := ctx.Query("department_id")
	if departmentID == "" {
		ctx.JSON(400, gin.H{"error": "Department ID is required"})
		return
	}
	departmentIDPrimitive, err := primitive.ObjectIDFromHex(departmentID)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Department ID format"})
		return
	}

	yearStr := ctx.Query("year")
	if yearStr == "" {
		ctx.JSON(400, gin.H{"error": "Year is required"})
		return
	}
	year, err := strconv.Atoi(yearStr)
	if err != nil || year < 1 {
		ctx.JSON(400, gin.H{"error": "Invalid year"})
		return
	}

	semesterStr := ctx.Query("semester")
	if semesterStr == "" {
		ctx.JSON(400, gin.H{"error": "Semester is required"})
		return
	}
	semester, err := strconv.Atoi(semesterStr)
	if err != nil || (semester != 1 && semester != 2) {
		ctx.JSON(400, gin.H{"error": "Invalid semester"})
		return
	}

	exams, err := ec.ExamUsecase.GetExamsInTree(ctx, departmentIDPrimitive, year, semester)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to retrieve exams"})
		return
	}

	ctx.JSON(200, gin.H{
		"exams": exams,
	})
}
