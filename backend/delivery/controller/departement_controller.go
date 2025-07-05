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

// Helper for error responses
func respondDeptWithError(ctx *gin.Context, code int, errMsg string) {
	ctx.JSON(code, gin.H{"error": errMsg})
}

// Helper to extract user ID from context
func getDeptUserID(ctx *gin.Context) (string, bool) {
	userID, exists := ctx.Get("user_id")
	if !exists {
		respondDeptWithError(ctx, 401, "Unauthorized")
		return "", false
	}
	userIDString, ok := userID.(string)
	if !ok {
		respondDeptWithError(ctx, 400, "Invalid user ID type")
		return "", false
	}
	return userIDString, true
}

func (d *DepartmentController) GetDepartments(ctx *gin.Context) {
	departments, err := d.DepartmentUsecase.GetDepartments(ctx)
	if err != nil {
		respondDeptWithError(ctx, 500, "Failed to get departments")
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
		respondDeptWithError(ctx, 400, "Department ID is required")
		return
	}

	departmentIDPrimitive, err := primitive.ObjectIDFromHex(departmentID)
	if err != nil {
		respondDeptWithError(ctx, 400, "Invalid Department ID format")
		return
	}

	department, err := d.DepartmentUsecase.GetDepartmentByID(ctx, departmentIDPrimitive)
	if err != nil {
		respondDeptWithError(ctx, 500, "Failed to get department")
		return
	}

	ctx.JSON(200, gin.H{
		"message":    "Department retrieved successfully",
		"department": department,
	})
}

func (d *DepartmentController) CreateDepartment(ctx *gin.Context) {
	userIDString, ok := getDeptUserID(ctx)
	if !ok {
		return
	}
	userIDPrimitive, err := primitive.ObjectIDFromHex(userIDString)
	if err != nil {
		respondDeptWithError(ctx, 400, "Invalid user ID"+err.Error())
		return
	}
	var department models.Departments
	if err := ctx.ShouldBindJSON(&department); err != nil {
		respondDeptWithError(ctx, 400, "Invalid input data")
		return
	}
	department.CreatedBy = userIDPrimitive
	department.CreatedAt = time.Now()
	createdDepartment, err := d.DepartmentUsecase.CreateDepartment(ctx, department)
	if err != nil {
		respondDeptWithError(ctx, 500, "Failed to create department")
		return
	}

	ctx.JSON(201, gin.H{
		"department": createdDepartment,
	})
}
