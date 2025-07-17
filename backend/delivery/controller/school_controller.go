package controller

import (
	"net/http"
	"strconv"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SchoolController struct {
	usecase usecases.SchoolUsecase
}

func NewSchoolController(usecase usecases.SchoolUsecase) *SchoolController {
	return &SchoolController{usecase: usecase}
}

func (c *SchoolController) GetSchools(ctx *gin.Context) {

	universityIDStr := ctx.Query("university_id")

	universityID, err := primitive.ObjectIDFromHex(universityIDStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid university ID"})
		return
	}
	page := ctx.Query("page")
	pageInt, err := strconv.Atoi(page)
	if err != nil || pageInt < 1 {
		pageInt = 1
	}
	schools, err := c.usecase.GetSchools(ctx, universityID, pageInt)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"schools": schools})
}

func (c *SchoolController) GetSchoolByID(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid school ID"})
		return
	}
	school, err := c.usecase.GetSchoolByID(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"school": school})
}

func (c *SchoolController) CreateSchool(ctx *gin.Context) {
	var schoolReq models.School
	if err := ctx.ShouldBindJSON(&schoolReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	school, err := c.usecase.CreateSchool(ctx, schoolReq)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{"school": school})
}

func (c *SchoolController) UpdateSchool(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid school ID"})
		return
	}
	var schoolReq models.School
	if err := ctx.ShouldBindJSON(&schoolReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	schoolReq.ID = id // Ensure the ID is set for the update

	school, err := c.usecase.UpdateSchool(ctx, schoolReq)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"school": school})
}

func (c *SchoolController) DeleteSchool(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid school ID"})
		return
	}
	if err := c.usecase.DeleteSchool(ctx, id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "School deleted"})
}

func (c *SchoolController) GetAllSchools(ctx *gin.Context) {
	page := ctx.Query("page")
	pageInt, err := strconv.Atoi(page)
	if err != nil || pageInt < 1 {
		pageInt = 1
	}
	schools, err := c.usecase.GetAllSchools(ctx, 1) // Default to page 1 for all schools
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"schools": schools})
}
