package controller

import (
	"fmt"
	"net/http"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserController struct {
	usecase usecases.UserUseCase
	storage usecases.StorageUseCase
}

func NewUserController(usecase usecases.UserUseCase, storage usecases.StorageUseCase) *UserController {
	return &UserController{usecase: usecase, storage: storage}
}

func (c *UserController) Me(ctx *gin.Context) {
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

	user, err := c.usecase.GetUserById(ctx, userIDStr)
	if err != nil {
		fmt.Println("Error fetching user:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user details"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"me": user})
}
func (c *UserController) CompleteUser(ctx *gin.Context) {

	// Grab user id
	userID, exist := ctx.Get("user_id")
	if !exist {
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		fmt.Println("Invalid user ID type:", userID)
		ctx.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}

	obId, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		fmt.Println("Invalid user ID format:", err)
		ctx.JSON(400, gin.H{"error": "Invalid user ID format"})
		return
	}

	// Parse the form data
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
	var user models.User

	// Grab school_id, university_id, and department_id from the form
	schoolID := form.Value["school_id"]
	universityID := form.Value["university_id"]
	departmentID := form.Value["department_id"]

	if len(schoolID) > 0 {
		schoolObjectID, err := primitive.ObjectIDFromHex(schoolID[0])
		if err != nil {
			fmt.Println("Invalid school ID format:", err)
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid school ID format"})
			return
		}
		user.SchoolID = &schoolObjectID
	}

	if len(universityID) > 0 {
		universityObjectID, err := primitive.ObjectIDFromHex(universityID[0])
		if err != nil {
			fmt.Println("Invalid university ID format:", err)
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid university ID format"})
			return
		}
		user.UniversityID = &universityObjectID
	}

	if len(departmentID) > 0 {
		departmentObjectID, err := primitive.ObjectIDFromHex(departmentID[0])
		if err != nil {
			fmt.Println("Invalid department ID format:", err)
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid department ID format"})
			return
		}
		user.DepartmentID = &departmentObjectID
	}

	user.ID = obId

	if user.UniversityID == nil || user.SchoolID == nil {
		fmt.Println("University ID or School ID is not provided")
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "University ID and School ID must be provided",
		})
		return
	}

	uploadedUser, err := c.usecase.CompleteUser(ctx, user)
	if err != nil {
		fmt.Println("Failed to complete user:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to complete user",
			"details": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "User completed successfully",
		"user":    uploadedUser,
	})
}
