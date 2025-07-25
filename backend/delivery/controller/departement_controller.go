package controller

import (
	"fmt"
	"strconv"
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
	page := ctx.Query("page")
	pageInt, err := strconv.Atoi(page)
	if pageInt <= 0 || err != nil {
		pageInt = 1
	}
	departments, err := d.DepartmentUsecase.GetDepartments(ctx, pageInt)
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

	if department.Name == "" {
		ctx.JSON(400, gin.H{"error": "Department name is required"})
		return
	}
	if department.SchoolID == primitive.NilObjectID {
		ctx.JSON(400, gin.H{"error": "School ID is required"})
		return
	}
	if department.Years == 0 {
		ctx.JSON(400, gin.H{"error": "Years is required"})
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

func (d *DepartmentController) UpdateDepartment(ctx *gin.Context) {
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

	var department models.Departments
	if err := ctx.ShouldBindJSON(&department); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input data"})
		return
	}
	department.ID = departmentIDPrimitive

	updatedDepartment, err := d.DepartmentUsecase.UpdateDepartment(ctx, department)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to update department"})
		return
	}

	ctx.JSON(200, gin.H{
		"message":    "Department updated successfully",
		"department": updatedDepartment,
	})
}

// DeleteDepartment deletes a department by its ID
func (d *DepartmentController) DeleteDepartment(ctx *gin.Context) {
	departmentID := ctx.Param("id")
	if departmentID == "" {
		ctx.JSON(400, gin.H{"error": "Department ID is required"})
		return
	}

	departmentIDPrimitive, err := primitive.ObjectIDFromHex(departmentID)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid Department ID format"})
		return
	}

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
	err = d.DepartmentUsecase.DeleteDepartment(ctx, departmentIDPrimitive, userIDPrimitive)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to delete department"})
		return
	}

	ctx.JSON(200, gin.H{
		"message": "Department deleted successfully",
	})
}

func (d *DepartmentController) GetDepartmentsInTree(ctx *gin.Context) {
	schoolID := ctx.Param("school_id")
	if schoolID == "" {
		fmt.Println("School ID is required")
		ctx.JSON(400, gin.H{"error": "School ID is required"})
		return
	}

	schoolIDPrimitive, err := primitive.ObjectIDFromHex(schoolID)
	if err != nil {
		fmt.Println("Invalid School ID format:", err)
		ctx.JSON(400, gin.H{"error": "Invalid School ID format"})
		return
	}

	departments, err := d.DepartmentUsecase.GetDepartmentsInTree(ctx, schoolIDPrimitive)
	if err != nil {
		fmt.Println("Failed to get departments in tree:", err)
		ctx.JSON(500, gin.H{"error": "Failed to get departments in tree"})
		return
	}

	ctx.JSON(200, gin.H{
		"message":     "Departments in tree retrieved successfully",
		"departments": departments,
	})
}
