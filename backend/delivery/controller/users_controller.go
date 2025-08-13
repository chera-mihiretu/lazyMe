package controller

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

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

func (c *UserController) UpdateMe(ctx *gin.Context) {
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

	var user models.User
	user.ID = obId
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

	// Grab school_id, university_id, and department_id from the form, with length checks
	universityIDSlice := form.Value["university_id"]
	if len(universityIDSlice) != 0 {
		universityID := universityIDSlice[0]
		universityIDPrim, err := primitive.ObjectIDFromHex(universityID)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid school_id: " + err.Error()})
			return
		}

		user.UniversityID = &universityIDPrim
	}
	schoolIDSlice := form.Value["school_id"]
	if len(schoolIDSlice) != 0 {
		if user.UniversityID != nil && *user.UniversityID != primitive.NilObjectID {

			schoolID := schoolIDSlice[0]
			schoolIDPrim, err := primitive.ObjectIDFromHex(schoolID)
			if err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid school_id: " + err.Error()})
				return
			}
			user.SchoolID = &schoolIDPrim
		} else {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "University ID must be provided before school ID",
			})
			return
		}

	}
	departmentIDSlice := form.Value["department_id"]
	if len(departmentIDSlice) != 0 {

		if user.SchoolID != nil && *user.SchoolID != primitive.NilObjectID {

			departmentID := departmentIDSlice[0]
			departmentIDPrim, err := primitive.ObjectIDFromHex(departmentID)
			if err != nil {
				ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid department_id: " + err.Error()})
				return
			}
			user.DepartmentID = &departmentIDPrim
		} else {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "School ID must be provided before department ID",
			})
			return
		}

	}

	name := form.Value["name"]
	year := form.Value["acedemic_year"]
	if len(name) == 1 {

		user.Name = name[0]
	}

	if len(year) == 1 {
		user.AcedemicYear, err = strconv.Atoi(year[0])
	}

	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid academic year format"})
		return
	}

	files := form.File["file"]
	if len(files) > 1 {
		fmt.Println("You can only upload a maximum of 1 file")
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "No files uploaded",
		})
		return
	}
	if len(files) != 0 {
		// Validate that all uploaded files are images
		for _, file := range files {
			contentType := file.Header.Get("Content-Type")
			if contentType != "image/jpeg" && contentType != "image/png" && contentType != "image/gif" {
				fmt.Println("Only image files are allowed. Got:", contentType)
				ctx.JSON(http.StatusBadRequest, gin.H{
					"error": "Only image files are allowed",
				})
				return
			}
		}

		urls, err := c.storage.UploadFile(files)

		if err != nil {
			fmt.Println("Failed to upload files:", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to upload files",
				"details": err.Error(),
			})
			return
		}
		user.ProfileImageURL = urls[0] // Assuming the first file is the profile image
	}

	log.Println("Up here all is good ")

	prevUser, err := c.usecase.UpdateMe(ctx, user)
	if err != nil {
		fmt.Println("Failed to update user:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.storage.DeleteFile([]string{prevUser.ProfileImageURL}) // Clean up previous profile image if it exists

	ctx.JSON(http.StatusOK, gin.H{"message": "User updated successfully", "user": user})
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
	files := form.File["file"]
	if len(files) > 1 {
		fmt.Println("You can only upload a maximum of 1 file")
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "No files uploaded",
		})
		return
	}
	if len(files) != 0 {
		// Validate that all uploaded files are images
		for _, file := range files {
			contentType := file.Header.Get("Content-Type")
			if contentType != "image/jpeg" && contentType != "image/png" && contentType != "image/gif" {
				fmt.Println("Only image files are allowed. Got:", contentType)
				ctx.JSON(http.StatusBadRequest, gin.H{
					"error": "Only image files are allowed",
				})
				return
			}
		}

		urls, err := c.storage.UploadFile(files)

		if err != nil {
			fmt.Println("Failed to upload files:", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Failed to upload files",
				"details": err.Error(),
			})
			return
		}
		user.ProfileImageURL = urls[0] // Assuming the first file is the profile image
	}

	uploadedUser, err := c.usecase.CompleteUser(ctx, user)

	if err != nil {
		c.storage.DeleteFile([]string{user.ProfileImageURL}) // Clean up if user creation fails
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

func (c *UserController) UserAnalytics(ctx *gin.Context) {
	userAnalytics, err := c.usecase.UserAnalytics(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"analytics": userAnalytics})
}

func (c *UserController) GetUserByID(ctx *gin.Context) {
	userIDStr := ctx.Param("id")
	if userIDStr == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User ID format"})
		return
	}

	user, err := c.usecase.GetUserById(ctx, userID.Hex())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user details"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"user": user})
}
