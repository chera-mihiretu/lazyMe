package controller

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MaterialController struct {
	MaterialUsecase usecases.MaterialUseCase
	StorageUsecase  usecases.StorageUseCase
}

func NewMaterialController(materialUsecase usecases.MaterialUseCase, storage usecases.StorageUseCase) *MaterialController {
	return &MaterialController{
		MaterialUsecase: materialUsecase,
		StorageUsecase:  storage,
	}
}

func (mc *MaterialController) GetMaterials(ctx *gin.Context) {

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
	materials, err := mc.MaterialUsecase.GetMaterials(ctx, userIDPrimitive, pageInt)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to retrieve materials"})
		return
	}

	ctx.JSON(200, gin.H{
		"materials": materials,
		"message":   "Materials retrieved successfully",
	})
}

func (mc *MaterialController) GetMaterialByID(ctx *gin.Context) {
	materialID := ctx.Param("id")
	if materialID == "" {
		ctx.JSON(400, gin.H{"error": "Material ID is required"})
		return
	}

	materialIDPrimitive, err := primitive.ObjectIDFromHex(materialID)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Material ID format"})
		return
	}

	material, err := mc.MaterialUsecase.GetMaterialByID(ctx, materialIDPrimitive)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to retrieve material"})
		return
	}

	ctx.JSON(200,
		gin.H{
			"materials": material,
			"message":   "Material retrieved successfully",
		})
}

func (mc *MaterialController) CreateMaterial(ctx *gin.Context) {
	// Grab user ID

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

	ctx.Request.Body = http.MaxBytesReader(ctx.Writer, ctx.Request.Body, 20<<20) // 10 MB limit
	form, err := ctx.MultipartForm()
	if err != nil {
		fmt.Println("Error parsing multipart form:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error":   "Failed to parse multipart form",
			"details": err.Error(),
		})
		return
	}

	var material models.Materials

	departmentID := form.Value["department_id"]
	if len(departmentID) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Department ID is required"})
		return
	}
	depId, err := primitive.ObjectIDFromHex(departmentID[0])
	if err != nil {
		fmt.Println("Invalid Department ID format:", err)
		ctx.JSON(400, gin.H{"error": "Invalid Department ID format"})
		return
	}
	material.DepartmentID = depId

	title := form.Value["title"]
	if len(title) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Title is required"})
		return
	}
	material.Title = title[0]

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
	material.Year = yearInt

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
	material.Semester = semesterInt

	material.UploadedBy = obId

	if material.DepartmentID.IsZero() {
		fmt.Println("Department ID is required")
		ctx.JSON(400, gin.H{"error": "Department ID is required"})
		return
	}
	if material.Year < 1 {
		fmt.Println("Year must be a positive integer")
		ctx.JSON(400, gin.H{"error": "Year must be a positive integer"})
		return
	}
	if material.Semester < 1 || material.Semester > 2 {
		fmt.Println("Semester must be either 1 or 2")
		ctx.JSON(400, gin.H{"error": "Semester must be either 1 or 2"})
		return
	}
	files := form.File["file"]
	if len(files) == 0 && len(material.FileURL) > 1 {
		fmt.Println("You have to upload one file")
		ctx.JSON(400, gin.H{"error": "You have to upload one file"})
		return
	}

	for _, file := range files {
		if file.Header.Get("Content-Type") != "application/pdf" {
			fmt.Println("Only PDF files are allowed")
			ctx.JSON(400, gin.H{"error": "Only PDF files are allowed"})
			return
		}
	}

	// TODO: Implement file storage logic
	urls, err := mc.StorageUsecase.UploadFile(files)

	if err != nil {
		fmt.Println("Failed to upload files:", err)
		ctx.JSON(500, gin.H{
			"error":   "Failed to upload files",
			"details": err.Error(),
		})
		return
	}

	material.FileURL = urls[0]

	newMaterial, err := mc.MaterialUsecase.CreateMaterial(ctx, material)
	if err != nil {
		mc.StorageUsecase.DeleteFile(urls) // Clean up uploaded file if creation fails

		fmt.Println("Failed to create material:", err)
		ctx.JSON(500, gin.H{"error": "Failed to create material"})
		return
	}

	ctx.JSON(201, gin.H{
		"message":  "Material created successfully",
		"material": newMaterial,
	})
}

func (mc *MaterialController) UpdateMaterial(ctx *gin.Context) {
	materialID := ctx.Param("id")
	if materialID == "" {
		ctx.JSON(400, gin.H{"error": "Material ID is required"})
		return
	}

	var material models.Materials
	if err := ctx.ShouldBindJSON(&material); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid request body"})
		return
	}

	materialIDPrimitive, err := primitive.ObjectIDFromHex(materialID)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Material ID format"})
		return
	}
	material.ID = materialIDPrimitive
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
	material.UploadedBy = userIDPrimitive

	material.UpdatedAt = time.Now()

	updatedMaterial, err := mc.MaterialUsecase.UpdateMaterial(ctx, material)
	if err != nil {

		ctx.JSON(500, gin.H{"error": "Failed to update material"})
		return
	}

	ctx.JSON(200, updatedMaterial)
}

func (mc *MaterialController) DeleteMaterial(ctx *gin.Context) {
	materialID := ctx.Param("id")
	if materialID == "" {
		ctx.JSON(400, gin.H{"error": "Material ID is required"})
		return
	}

	materialIDPrimitive, err := primitive.ObjectIDFromHex(materialID)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Material ID format"})
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

	material, err := mc.MaterialUsecase.GetMaterialByID(ctx, materialIDPrimitive)
	if err != nil {
		ctx.JSON(404, gin.H{"error": "Material not found"})
		return
	}
	if material.UploadedBy != userIDPrimitive {
		ctx.JSON(403, gin.H{"error": "You are not authorized to delete this material"})
		return
	}

	err = mc.MaterialUsecase.DeleteMaterial(ctx, userIDPrimitive, materialIDPrimitive)

	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to delete material"})
		return
	}

	mc.StorageUsecase.DeleteFile([]string{material.FileURL}) // Clean up the file from storage

	ctx.JSON(204, gin.H{
		"message": "Material deleted successfully",
	})
}

func (mc *MaterialController) GetMaterialsInTree(ctx *gin.Context) {
	fmt.Println(ctx.Request.URL)
	departmentID := ctx.Query("department_id")
	if departmentID == "" {
		ctx.JSON(400, gin.H{"error": "Department ID is required"})
		return
	}
	fmt.Println("Department ID:", departmentID)
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
	fmt.Println("Semester:", semesterStr, "Year:", year, "Department ID:", departmentID)
	semester, err := strconv.Atoi(semesterStr)
	if err != nil || (semester != 1 && semester != 2) {
		ctx.JSON(400, gin.H{"error": "Invalid semester"})
		return
	}

	materials, err := mc.MaterialUsecase.GetMaterialsInTree(ctx, departmentIDPrimitive, year, semester)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to retrieve materials"})
		return
	}

	ctx.JSON(200, gin.H{
		"materials": materials,
	})
}
