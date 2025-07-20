package controller

import (
	"fmt"
	"net/http"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UniversityController struct {
	usecase usecases.UniversityUsecase
}

func NewUniversityController(usecase usecases.UniversityUsecase) *UniversityController {
	return &UniversityController{usecase: usecase}
}

func (c *UniversityController) GetUniversities(ctx *gin.Context) {
	universities, err := c.usecase.GetUniversities(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"universities": universities})
}

func (c *UniversityController) GetUniversityByID(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid university ID"})
		return
	}
	university, err := c.usecase.GetUniversityByID(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"university": university})
}

func (c *UniversityController) CreateUniversity(ctx *gin.Context) {
	userID, exist := ctx.Get("user_id")
	if !exist {
		fmt.Println("Error: User ID not found in context")
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		fmt.Println("Error: Invalid user ID type:", userID)
		ctx.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}
	userIDPri, err := primitive.ObjectIDFromHex(userIDStr)

	if err != nil {
		fmt.Println("Error: Invalid user ID format:", userIDStr, "Error:", err)
		ctx.JSON(400, gin.H{"error": "Invalid user ID format"})
		return
	}
	var universityReq models.University
	if err := ctx.ShouldBindJSON(&universityReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	universityReq.CreatedBy = userIDPri
	if universityReq.Name == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "University name is required"})
		return
	}
	university, err := c.usecase.CreateUniversity(ctx, universityReq)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{"university": university})
}

func (c *UniversityController) UpdateUniversity(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid university ID"})
		return
	}

	var universityReq models.University
	universityReq.ID = id // Ensure the ID is set for the update
	if err := ctx.ShouldBindJSON(&universityReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	university, err := c.usecase.UpdateUniversity(ctx, universityReq)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"university": university})
}

func (c *UniversityController) DeleteUniversity(ctx *gin.Context) {
	userID, exist := ctx.Get("user_id")
	if !exist {
		fmt.Println("Error: User ID not found in context")
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		fmt.Println("Error: Invalid user ID type:", userID)
		ctx.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}
	userIDPri, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		fmt.Println("Error: Invalid user ID format:", userIDStr, "Error:", err)
		ctx.JSON(400, gin.H{"error": "Invalid user ID format"})
		return
	}

	idStr := ctx.Param("id")
	id, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid university ID"})
		return
	}
	if err := c.usecase.DeleteUniversity(ctx, id, userIDPri); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "University deleted"})
}
