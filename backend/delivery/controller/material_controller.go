package controller

import (
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

	// Collect the files
	ctx.Request.Body = http.MaxBytesReader(ctx.Writer, ctx.Request.Body, 20<<20) // 20 MB limit
	form, err := ctx.MultipartForm()
	if err != nil {
		ctx.JSON(400, gin.H{
			"error":   "Failed to parse multipart form",
			"details": err.Error(),
		})
		return
	}

	var material models.Materials
	if err := ctx.ShouldBind(&material); err != nil {
		ctx.JSON(400, gin.H{
			"error":   "Invalid or missing form data. Ensure all required fields are provided and correctly formatted.",
			"details": err.Error(),
		})
		return
	}

	material.UploadedBy = obId

	files := form.File["file"]
	if len(files) == 0 {
		ctx.JSON(400, gin.H{"error": "No files uploaded"})
		return
	}

	for _, file := range files {
		if file.Header.Get("Content-Type") != "application/pdf" {
			ctx.JSON(400, gin.H{"error": "Only PDF files are allowed"})
			return
		}
	}

	if len(files) > 1 {
		ctx.JSON(400, gin.H{"error": "Only one file can be uploaded at a time"})
		return
	}

	// TODO: Implement file storage logic
	urls, err := mc.StorageUsecase.UploadFile(files)

	if err != nil {
		ctx.JSON(500, gin.H{
			"error":   "Failed to upload files",
			"details": err.Error(),
		})
		return
	}

	material.FileURL = urls[0]

	newMaterial, err := mc.MaterialUsecase.CreateMaterial(ctx, material)
	if err != nil {
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

	err = mc.MaterialUsecase.DeleteMaterial(ctx, userIDPrimitive, materialIDPrimitive)

	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to delete material"})
		return
	}

	ctx.JSON(204, gin.H{
		"message": "Material deleted successfully",
	})
}
