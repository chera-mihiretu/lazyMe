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
	var schoolReq models.School
	if err := ctx.ShouldBindJSON(&schoolReq); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	schoolReq.CreatedBy = userIDPri

	if schoolReq.UniversityID.IsZero() {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "University ID is required"})
		return
	}
	if schoolReq.Name == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "School name is required"})
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
	if err := c.usecase.DeleteSchool(ctx, id, userIDPri); err != nil {
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

	if schools == nil {
		schools = []models.School{} // Ensure schools is not nil
	}
	ctx.JSON(http.StatusOK, gin.H{"schools": schools})
}
