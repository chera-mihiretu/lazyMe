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

// Helper for error responses
func respondPostWithError(ctx *gin.Context, code int, errMsg string) {
	ctx.JSON(code, gin.H{"error": errMsg})
}

// Helper to extract user ID from context
func getPostUserID(ctx *gin.Context) (string, bool) {
	userID, exist := ctx.Get("user_id")
	if !exist {
		respondPostWithError(ctx, 400, "User ID not found in context")
		return "", false
	}
	userIDStr, ok := userID.(string)
	if !ok {
		respondPostWithError(ctx, 400, "Invalid user ID type")
		return "", false
	}
	return userIDStr, true
}

func (p *PostController) GetPosts(ctx *gin.Context) {
	page := ctx.Query("page")
	if page == "" {
		respondPostWithError(ctx, http.StatusBadRequest, "page is requried")
		return
	}
	pageInt, err := strconv.Atoi(page)
	if err != nil || pageInt < 1 {
		respondPostWithError(ctx, http.StatusBadRequest, "Invalid page number")
		return
	}
	userIDStr, ok := getPostUserID(ctx)
	if !ok {
		return
	}
	post, err := p.postUseCase.GetPosts(ctx, userIDStr, pageInt)
	if err != nil {
		respondPostWithError(ctx, 500, "Failed to get posts "+err.Error())
		return
	}
	userViewPost, err := p.GetPostWithUsers(ctx, post)
	if err != nil {
		respondPostWithError(ctx, 500, "There is problem converting post into json"+err.Error())
		return
	}
	ctx.JSON(200, gin.H{"message": "Post are fetched", "posts": userViewPost})
}

func (p *PostController) GetPostByID(ctx *gin.Context) {
	postID := ctx.Query("id")
	if postID == "" {
		respondPostWithError(ctx, 400, "Post ID is required")
		return
	}
	post, err := p.postUseCase.GetPostByID(ctx, postID)
	if err != nil {
		respondPostWithError(ctx, 500, "Failed to get post "+err.Error())
		return
	}
	postView, err := p.GetPostWithUsers(ctx, []models.Posts{post})
	if err != nil {
		respondPostWithError(ctx, 500, "Failed to get post "+err.Error())
		return
	}
	ctx.JSON(200, gin.H{"message": "Post fetched successfully", "post": postView[0]})
}

func (p *PostController) CreatePost(ctx *gin.Context) {
	userIDStr, ok := getPostUserID(ctx)
	if !ok {
		return
	}
	obId, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		respondPostWithError(ctx, 400, "Invalid user ID format")
		return
	}
	ctx.Request.Body = http.MaxBytesReader(ctx.Writer, ctx.Request.Body, 20<<20)
	form, err := ctx.MultipartForm()
	if err != nil {
		respondPostWithError(ctx, http.StatusBadRequest, "Failed to parse multipart form: "+err.Error())
		return
	}
	var post models.Posts
	if err := ctx.ShouldBind(&post); err != nil {
		respondPostWithError(ctx, http.StatusBadRequest, "Invalid or missing form data. Ensure all required fields are provided and correctly formatted: "+err.Error())
		return
	}
	post.UserID = obId
	files := form.File["files"]
	if len(files) == 0 {
		respondPostWithError(ctx, http.StatusBadRequest, "No files uploaded")
		return
	}
	if post.Content == "" {
		respondPostWithError(ctx, http.StatusBadRequest, "Content is required")
		return
	}
	for _, file := range files {
		contentType := file.Header.Get("Content-Type")
		if contentType != "image/jpeg" && contentType != "image/png" && contentType != "image/gif" {
			respondPostWithError(ctx, http.StatusBadRequest, "Only image files are allowed")
			return
		}
	}
	urls, err := p.storage.UploadFile(files)
	if err != nil {
		respondPostWithError(ctx, http.StatusInternalServerError, "Failed to upload files: "+err.Error())
		return
	}
	post.PostAttachments = urls
	uploadedPost, err := p.postUseCase.CreatePost(ctx, post)
	if err != nil {
		respondPostWithError(ctx, http.StatusInternalServerError, "Failed to create post: "+err.Error())
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{"message": "Post created successfully", "post": uploadedPost})
}

func (p *PostController) UpdatePost(ctx *gin.Context) {
	var post models.Posts
	if err := ctx.ShouldBind(&post); err != nil {
		respondPostWithError(ctx, http.StatusBadRequest, "Invalid or missing form data. Ensure all required fields are provided and correctly formatted: "+err.Error())
		return
	}
	postID := ctx.Param("id")
	if postID == "" {
		respondPostWithError(ctx, http.StatusBadRequest, "Post ID is required")
		return
	}
	userIDStr, ok := getPostUserID(ctx)
	if !ok {
		return
	}
	userIDPrimitive, _ := primitive.ObjectIDFromHex(userIDStr)
	postIDPrimitive, err := primitive.ObjectIDFromHex(postID)
	if err != nil {
		respondPostWithError(ctx, 400, "Invalid Post ID format")
		return
	}
	post.ID = postIDPrimitive
	post.UserID = userIDPrimitive
	post, err = p.postUseCase.UpdatePost(ctx, post)
	if err != nil {
		respondPostWithError(ctx, 500, "Failed to get post "+err.Error())
		return
	}
	postView, err := p.GetPostWithUsers(ctx, []models.Posts{post})
	if err != nil {
		respondPostWithError(ctx, 500, "Failed to get post "+err.Error())
		return
	}
	ctx.JSON(200, gin.H{"message": "Post updated successfully", "post": postView[0]})
}

func (p *PostController) DeletePost(ctx *gin.Context) {
	postID := ctx.Query("id")
	if postID == "" {
		respondPostWithError(ctx, 400, "Post ID is required")
		return
	}
	userIDStr, ok := getPostUserID(ctx)
	if !ok {
		return
	}
	err := p.postUseCase.DeletePost(ctx, userIDStr, postID)
	if err != nil {
		respondPostWithError(ctx, 500, "Failed to delete post "+err.Error())
		return
	}
	ctx.JSON(200, gin.H{"message": "Post deleted successfully"})
}

func (p *PostController) GetMyPosts(ctx *gin.Context) {
	pageStr := ctx.Query("page")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		respondPostWithError(ctx, 400, "Invalid page number")
		return
	}
	userIDStr, ok := getPostUserID(ctx)
	if !ok {
		return
	}
	posts, err := p.postUseCase.GetPostsByUserID(ctx, userIDStr, page)
	if err != nil {
		respondPostWithError(ctx, 500, "Failed to get posts "+err.Error())
		return
	}
	postViews, err := p.GetPostWithUsers(ctx, posts)
	if err != nil {
		respondPostWithError(ctx, 500, "Failed to get posts "+err.Error())
		return
	}
	ctx.JSON(200, gin.H{"posts": postViews, "page": page})
}

func (p *PostController) GetPostsByUserID(ctx *gin.Context) {
	userID := ctx.Query("id")
	pageStr := ctx.Query("page")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		respondPostWithError(ctx, 400, "Invalid page number")
		return
	}
	posts, err := p.postUseCase.GetPostsByUserID(ctx, userID, page)
	if err != nil {
		respondPostWithError(ctx, 500, "Failed to get posts "+err.Error())
		return
	}
	postViews, err := p.GetPostWithUsers(ctx, posts)
	if err != nil {
		respondPostWithError(ctx, 500, "Failed to get posts "+err.Error())
		return
	}
	ctx.JSON(200, gin.H{"posts": postViews, "page": page})
}

func (p *PostController) GetPostWithUsers(ctx *gin.Context, posts []models.Posts) ([]models.PostView, error) {
	// Collect user IDs
	userIDSet := make(map[string]struct{})
	for _, post := range posts {
		userIDSet[post.UserID.Hex()] = struct{}{}
	}
	userIDs := make([]primitive.ObjectID, 0, len(userIDSet))
	for id := range userIDSet {
		objID, err := primitive.ObjectIDFromHex(id)
		if err == nil {
			userIDs = append(userIDs, objID)
		}
	}

	// Fetch user info
	users, err := p.userUseCase.GetListOfUsers(ctx, userIDs)
	if err != nil {
		return []models.PostView{}, err
	}
	userMap := make(map[string]models.UserView)
	for _, user := range users {
		userMap[user.ID.Hex()] = user
	}

	// Pair posts with user info
	postViews := make([]models.PostView, 0, len(posts))
	for _, post := range posts {
		userView, ok := userMap[post.UserID.Hex()]
		if !ok {
			continue // or handle missing user
		}
		postViews = append(postViews, models.PostView{
			ID:              post.ID,
			UserID:          userView,
			Content:         post.Content,
			PostAttachments: post.PostAttachments,
			IsAnnouncement:  post.IsAnnouncement,
			IsValidated:     post.IsValidated,
			IsFlagged:       post.IsFlagged,
			Likes:           post.Likes,
			Comments:        post.Comments,
			CreatedAt:       post.CreatedAt,
		})
	}
	return postViews, nil
}
