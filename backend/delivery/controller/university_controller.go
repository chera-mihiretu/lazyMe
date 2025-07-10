package controller

import (
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
	var universityReq models.University
	if err := ctx.ShouldBindJSON(&universityReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
	idStr := ctx.Param("id")
	id, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid university ID"})
		return
	}
	if err := c.usecase.DeleteUniversity(ctx, id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "University deleted"})
}
