package controller

import (
	"time"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DepartmentController struct {
	DepartmentUsecase usecases.DepartmentUseCase
}

func NewDepartmentController(departmentUsecase usecases.DepartmentUseCase) *DepartmentController {
	return &DepartmentController{
		DepartmentUsecase: departmentUsecase,
	}
}

func (d *DepartmentController) GetDepartments(ctx *gin.Context) {
	departments, err := d.DepartmentUsecase.GetDepartments(ctx)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to get departments"})
		return
	}
	ctx.JSON(200, gin.H{
		"message":     "Departments retrieved successfully",
		"departments": departments,
	})
}

func (d *DepartmentController) GetDepartmentByID(ctx *gin.Context) {
	departmentID := ctx.Query("id")
	if departmentID == "" {
		ctx.JSON(400, gin.H{"error": "Department ID is required"})
		return
	}

	departmentIDPrimitive, err := primitive.ObjectIDFromHex(departmentID)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Department ID format"})
		return
	}

	department, err := d.DepartmentUsecase.GetDepartmentByID(ctx, departmentIDPrimitive)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to get department"})
		return
	}

	ctx.JSON(200, gin.H{
		"message":    "Department retrieved successfully",
		"department": department,
	})
}

func (d *DepartmentController) CreateDepartment(ctx *gin.Context) {
	userID, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(401, gin.H{"error": "Unauthorized"})
		return
	}
	userIDString, ok := userID.(string)
	if !ok {
		ctx.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}
	// Ensure userID is of type primitive.ObjectID
	userIDPrimitive, err := primitive.ObjectIDFromHex(userIDString)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid user ID" + err.Error()})
		return
	}

	var department models.Departments
	if err := ctx.ShouldBindJSON(&department); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input data"})
		return
	}
	department.CreatedBy = userIDPrimitive
	department.CreatedAt = time.Now()
	createdDepartment, err := d.DepartmentUsecase.CreateDepartment(ctx, department)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to create department"})
		return
	}

	ctx.JSON(201, gin.H{
		"department": createdDepartment,
	})
}
