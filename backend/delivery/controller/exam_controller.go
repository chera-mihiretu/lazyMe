package controller

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ExamController struct {
	ExamUsecase    usecases.ExamUseCase
	StorageUsecase usecases.StorageUseCase
}

func NewExamController(examUsecase usecases.ExamUseCase, storage usecases.StorageUseCase) *ExamController {
	return &ExamController{
		ExamUsecase:    examUsecase,
		StorageUsecase: storage,
	}
}

// GetExams godoc
// @Summary Get paginated exams
// @Description Retrieve exams for the logged-in user with pagination
// @Tags Exams
// @Accept json
// @Produce json
// @Param page query int true "Page number"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Security BearerAuth
// @Router /api/exams [get]
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

// GetExamByID godoc
// @Summary Get a exam by ID
// @Description Returns a exam by its ID
// @Tags Exams
// @Produce json
// @Param id path string true "Exam ID"
// @Success 200 {object} models.Exam
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Security BearerAuth
// @Router /api/exams/{id} [get]
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

// CreateExam godoc
// @Summary Create a new exam
// @Description Upload a PDF exam with title, year, semester, and department ID
// @Tags Exams
// @Accept multipart/form-data
// @Produce json
// @Param title formData string true "Title of the exam"
// @Param year formData int true "Year of study"
// @Param semester formData int true "Semester (1 or 2)"
// @Param department_id formData string true "Department ID"
// @Param file formData file true "PDF file to upload"
// @Success 201 {object} models.Exam
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Security BearerAuth
// @Router /api/exams [post]
func (ec *ExamController) CreateExam(ctx *gin.Context) {
	userID, exist := ctx.Get("user_id")
	if !exist {
		fmt.Println("User ID not found in context")
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		fmt.Println("Invalid user ID type")
		ctx.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}
	obId, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		fmt.Println("Invalid user ID format")
		ctx.JSON(400, gin.H{"error": "Invalid user ID format"})
		return
	}

	ctx.Request.Body = http.MaxBytesReader(ctx.Writer, ctx.Request.Body, 20<<20) // 20 MB
	form, err := ctx.MultipartForm()
	if err != nil {
		fmt.Println("Failed to parse multipart form")
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
		fmt.Println("Department ID is required")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Department ID is required"})
		return
	}
	depId, err := primitive.ObjectIDFromHex(departmentID[0])
	if err != nil {
		fmt.Println("Invalid Department ID format")
		ctx.JSON(400, gin.H{"error": "Invalid Department ID format"})
		return
	}
	exam.DepartmentID = depId

	// Title
	title := form.Value["title"]
	if len(title) == 0 {
		fmt.Println("Title is required")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Title is required"})
		return
	}
	exam.Title = title[0]

	// Year
	year := form.Value["year"]
	if len(year) == 0 {
		fmt.Println("Year is required")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Year is required"})
		return
	}
	yearInt, err := strconv.Atoi(year[0])
	if err != nil || yearInt < 1 {
		fmt.Println("Year must be a positive integer")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Year must be a positive integer"})
		return
	}
	exam.Year = yearInt

	// Semester
	semester := form.Value["semester"]
	if len(semester) == 0 {
		fmt.Println("Semester is required")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Semester is required"})
		return
	}
	semesterInt, err := strconv.Atoi(semester[0])
	if err != nil || (semesterInt != 1 && semesterInt != 2) {
		fmt.Println("Semester must be either 1 or 2")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Semester must be either 1 or 2"})
		return
	}
	exam.Semester = semesterInt

	exam.UploadedBy = obId

	/////////////////////checkpoint----////

	// File validation
	files := form.File["file"]
	if len(files) == 0 {
		fmt.Println("You must upload a file")
		ctx.JSON(400, gin.H{"error": "You must upload a file"})
		return
	}
	for _, file := range files {
		if file.Header.Get("Content-Type") != "application/pdf" {
			fmt.Println("Only PDF files are allowed")
			ctx.JSON(400, gin.H{"error": "Only PDF files are allowed"})
			return
		}
	}

	// Upload file
	urls, err := ec.StorageUsecase.UploadFile(files)
	if err != nil {
		fmt.Println("Failed to upload files", err)
		ctx.JSON(500, gin.H{"error": "Failed to upload files", "details": err.Error()})
		return
	}

	fmt.Println("Uploading file", urls)

	exam.FileURL = urls[0]

	newExam, err := ec.ExamUsecase.CreateExam(ctx, exam)
	if err != nil {
		ec.StorageUsecase.DeleteFile(urls) // rollback
		fmt.Println("Failed to create exam", err)
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
		fmt.Println("User ID not found in context")
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		fmt.Println("Invalid user ID type")
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
