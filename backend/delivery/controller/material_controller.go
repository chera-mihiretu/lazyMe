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

// Helper for error responses
func respondMatWithError(ctx *gin.Context, code int, errMsg string) {
	ctx.JSON(code, gin.H{"error": errMsg})
}

// Helper to extract user ID from context
func getMatUserID(ctx *gin.Context) (string, bool) {
	userID, exist := ctx.Get("user_id")
	if !exist {
		respondMatWithError(ctx, 400, "User ID not found in context")
		return "", false
	}
	userIDStr, ok := userID.(string)
	if !ok {
		respondMatWithError(ctx, 400, "Invalid user ID type")
		return "", false
	}
	return userIDStr, true
}

func (mc *MaterialController) GetMaterials(ctx *gin.Context) {
	userIDStr, ok := getMatUserID(ctx)
	if !ok {
		return
	}
	userIDPrimitive, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		respondMatWithError(ctx, 400, "Invalid User ID format")
		return
	}
	page := ctx.Query("page")
	if page == "" {
		respondMatWithError(ctx, 400, "Page number is required")
		return
	}
	pageInt, err := strconv.Atoi(page)
	if err != nil || pageInt < 1 {
		respondMatWithError(ctx, 400, "Invalid page number")
		return
	}
	materials, err := mc.MaterialUsecase.GetMaterials(ctx, userIDPrimitive, pageInt)
	if err != nil {
		respondMatWithError(ctx, 500, "Failed to retrieve materials")
		return
	}
	ctx.JSON(200, gin.H{"materials": materials, "message": "Materials retrieved successfully"})
}

func (mc *MaterialController) GetMaterialByID(ctx *gin.Context) {
	materialID := ctx.Param("id")
	if materialID == "" {
		respondMatWithError(ctx, 400, "Material ID is required")
		return
	}
	materialIDPrimitive, err := primitive.ObjectIDFromHex(materialID)
	if err != nil {
		respondMatWithError(ctx, 400, "Invalid Material ID format")
		return
	}
	material, err := mc.MaterialUsecase.GetMaterialByID(ctx, materialIDPrimitive)
	if err != nil {
		respondMatWithError(ctx, 500, "Failed to retrieve material")
		return
	}
	ctx.JSON(200, gin.H{"materials": material, "message": "Material retrieved successfully"})
}

func (mc *MaterialController) CreateMaterial(ctx *gin.Context) {
	userIDStr, ok := getMatUserID(ctx)
	if !ok {
		return
	}
	obId, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		respondMatWithError(ctx, 400, "Invalid user ID format")
		return
	}
	ctx.Request.Body = http.MaxBytesReader(ctx.Writer, ctx.Request.Body, 20<<20)
	form, err := ctx.MultipartForm()
	if err != nil {
		respondMatWithError(ctx, 400, "Failed to parse multipart form: "+err.Error())
		return
	}
	var material models.Materials
	if err := ctx.ShouldBind(&material); err != nil {
		respondMatWithError(ctx, 400, "Invalid or missing form data. Ensure all required fields are provided and correctly formatted: "+err.Error())
		return
	}
	material.UploadedBy = obId
	files := form.File["file"]
	if len(files) == 0 {
		respondMatWithError(ctx, 400, "No files uploaded")
		return
	}
	for _, file := range files {
		if file.Header.Get("Content-Type") != "application/pdf" {
			respondMatWithError(ctx, 400, "Only PDF files are allowed")
			return
		}
	}
	if len(files) > 1 {
		respondMatWithError(ctx, 400, "Only one file can be uploaded at a time")
		return
	}
	urls, err := mc.StorageUsecase.UploadFile(files)
	if err != nil {
		respondMatWithError(ctx, 500, "Failed to upload files: "+err.Error())
		return
	}
	material.FileURL = urls[0]
	newMaterial, err := mc.MaterialUsecase.CreateMaterial(ctx, material)
	if err != nil {
		respondMatWithError(ctx, 500, "Failed to create material")
		return
	}
	ctx.JSON(201, gin.H{"message": "Material created successfully", "material": newMaterial})
}

func (mc *MaterialController) UpdateMaterial(ctx *gin.Context) {
	materialID := ctx.Param("id")
	if materialID == "" {
		respondMatWithError(ctx, 400, "Material ID is required")
		return
	}
	var material models.Materials
	if err := ctx.ShouldBindJSON(&material); err != nil {
		respondMatWithError(ctx, 400, "Invalid request body")
		return
	}
	materialIDPrimitive, err := primitive.ObjectIDFromHex(materialID)
	if err != nil {
		respondMatWithError(ctx, 400, "Invalid Material ID format")
		return
	}
	material.ID = materialIDPrimitive
	userIDStr, ok := getMatUserID(ctx)
	if !ok {
		return
	}
	userIDPrimitive, _ := primitive.ObjectIDFromHex(userIDStr) // ignore err, already validated in getMatUserID
	material.UploadedBy = userIDPrimitive
	material.UpdatedAt = time.Now()
	updatedMaterial, err := mc.MaterialUsecase.UpdateMaterial(ctx, material)
	if err != nil {
		respondMatWithError(ctx, 500, "Failed to update material")
		return
	}
	ctx.JSON(200, updatedMaterial)
}

func (mc *MaterialController) DeleteMaterial(ctx *gin.Context) {
	materialID := ctx.Param("id")
	if materialID == "" {
		respondMatWithError(ctx, 400, "Material ID is required")
		return
	}
	materialIDPrimitive, err := primitive.ObjectIDFromHex(materialID)
	if err != nil {
		respondMatWithError(ctx, 400, "Invalid Material ID format")
		return
	}
	userIDStr, ok := getMatUserID(ctx)
	if !ok {
		return
	}
	userIDPrimitive, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		respondMatWithError(ctx, 400, "Invalid User ID format")
		return
	}
	err = mc.MaterialUsecase.DeleteMaterial(ctx, userIDPrimitive, materialIDPrimitive)
	if err != nil {
		respondMatWithError(ctx, 500, "Failed to delete material")
		return
	}
	ctx.JSON(204, gin.H{"message": "Material deleted successfully"})
}
