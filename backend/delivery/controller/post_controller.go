package controller

import (
	"net/http"
	"strconv"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PostController struct {
	postUseCase       usecases.PostUseCase
	userUseCase       usecases.UserUseCase
	departmentUsecase usecases.DepartmentUseCase
	storage           usecases.StorageUseCase
}

func NewPostController(
	post usecases.PostUseCase,
	user usecases.UserUseCase,
	department usecases.DepartmentUseCase,
	storage usecases.StorageUseCase) *PostController {

	return &PostController{
		postUseCase:       post,
		userUseCase:       user,
		departmentUsecase: department,
		storage:           storage,
	}
}

func (p *PostController) GetPosts(ctx *gin.Context) {

}

func (p *PostController) GetPostByID(ctx *gin.Context) {

}
func (p *PostController) CreatePost(ctx *gin.Context) {
	// Grab user id
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
	// Collect the files
	ctx.Request.Body = http.MaxBytesReader(ctx.Writer, ctx.Request.Body, 20<<20) // 10 MB limit
	form, err := ctx.MultipartForm()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error":   "Failed to parse multipart form",
			"details": err.Error(),
		})
		return
	}
	var post models.Posts
	if err := ctx.ShouldBind(&post); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid or missing form data. Ensure all required fields are provided and correctly formatted.",
			"details": err.Error(),
		})
		return
	}
	post.UserID = obId
	// Increase the maximum memory for multipart form parsing to handle larger files

	files := form.File["files"]
	if len(files) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "No files uploaded",
		})
		return
	}

	if post.Content == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Content is required",
		})
		return
	}

	// Validate that all uploaded files are images
	for _, file := range files {
		contentType := file.Header.Get("Content-Type")
		if contentType != "image/jpeg" && contentType != "image/png" && contentType != "image/gif" {
			ctx.JSON(http.StatusBadRequest, gin.H{
				"error": "Only image files are allowed",
			})
			return
		}
	}
	// TODO : Implement the data storage
	urls, err := p.storage.UploadFile(files)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to upload files",
			"details": err.Error(),
		})
		return
	}

	post.PostAttachments = urls

	uploadedPost, err := p.postUseCase.CreatePost(ctx, post)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create post",
			"details": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Post created successfully",
		"post":    uploadedPost,
	})

}

func (p *PostController) UpdatePost(ctx *gin.Context) {

}

func (p *PostController) DeletePost(ctx *gin.Context) {

}

func (p *PostController) GetMyPosts(ctx *gin.Context) {
	pageStr := ctx.Query("page")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		ctx.JSON(400, gin.H{"error": "Invalid page number"})
		return
	}
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

	posts, err := p.postUseCase.GetPostsByUserID(ctx, userIDStr, page)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to get posts"})
		return
	}

	ctx.JSON(200, gin.H{
		"posts": posts,
		"page":  page,
	})
}

func (p *PostController) GetPostsByUserID(ctx *gin.Context) {
	userID := ctx.Query("id")
	pageStr := ctx.Query("page")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		ctx.JSON(400, gin.H{"error": "Invalid page number"})
		return
	}

	posts, err := p.postUseCase.GetPostsByUserID(ctx, userID, page)
	if err != nil {
		ctx.JSON(500, gin.H{"error" : "Failed to get posts " + err.Error()})
		return
	}

	ctx.JSON(200, gin.H{
		"posts": posts,
		"page":  page,
	})
}
