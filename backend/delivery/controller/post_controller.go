package controller

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PostController struct {
	postUseCase       usecases.PostUseCase
	userUseCase       usecases.UserUseCase
	departmentUsecase usecases.DepartmentUseCase
	storage           usecases.StorageUseCase
	PostlikeUseCase   usecases.PostLikeUsecase
}

func NewPostController(
	post usecases.PostUseCase,
	user usecases.UserUseCase,
	department usecases.DepartmentUseCase,
	storage usecases.StorageUseCase,
	liked usecases.PostLikeUsecase) *PostController {

	return &PostController{
		postUseCase:       post,
		userUseCase:       user,
		departmentUsecase: department,
		storage:           storage,
		PostlikeUseCase:   liked,
	}
}

func (p *PostController) SearchPosts(ctx *gin.Context) {

	query := ctx.Query("q")
	if query == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Query parameter 'q' is required"})
		return
	}

	pageStr := ctx.Query("page")
	if pageStr == "" {
		pageStr = "1" // Default to page 1 if not provided
	}
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
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

	userIDPrimitive, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid User ID format"})
		return
	}

	posts, err := p.postUseCase.SearchPosts(ctx, query, page)
	if err != nil {
		fmt.Println("Error searching posts:", err)
		ctx.JSON(500, gin.H{"error": "Failed to search posts: " + err.Error()})
		return
	}

	nextPage := len(posts) > repository.Pagesize

	filteredPosts, err := p.RemoveMyPost(userIDPrimitive, posts[:min(len(posts), repository.Pagesize)])
	if err != nil {
		fmt.Println("Error removing user's posts:", err)
		ctx.JSON(500, gin.H{"error": "Failed to remove user's posts: " + err.Error()})
		return
	}

	postViews, err := p.GetPostWithUsers(ctx, filteredPosts)
	if err != nil {
		fmt.Println("Error getting posts with user info:", err)
		ctx.JSON(500, gin.H{"error": "Failed to get posts (user view): " + err.Error()})
		return
	}

	ctx.JSON(200, gin.H{
		"posts": postViews,
		"next":  nextPage,
	})

}

func (p *PostController) GetPosts(ctx *gin.Context) {
	page := ctx.Query("page")
	if page == "" {
		fmt.Println("Error: page is required")
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": "page is requried",
			},
		)
		return
	}
	pageInt, err := strconv.Atoi(page)
	if err != nil || pageInt < 1 {
		fmt.Println("Error: Invalid page number:", err)
		ctx.JSON(
			http.StatusBadRequest,
			gin.H{
				"error": "Invalid page number",
			},
		)
		return
	}
	userID, exist := ctx.Get("user_id")
	if !exist {
		log.Println("Error: User ID not found in context")
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		log.Println("Error: Invalid user ID type:", userID)
		ctx.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}

	post, err := p.postUseCase.GetPosts(ctx, userIDStr, pageInt)
	if err != nil {
		log.Println("Error fetching posts:", err)

		ctx.JSON(500,
			gin.H{
				"message": "There is problem fetching posts" + err.Error(),
			})
		return
	}
	nextPage := len(post) > repository.Pagesize

	userViewPost, err := p.GetPostWithUsers(ctx, post[:min(len(post), repository.Pagesize)])

	if err != nil {
		log.Println("Error converting post into json:", err)
		ctx.JSON(500,
			gin.H{
				"message": "There is problem converting post into json" + err.Error(),
			})
		return
	}

	ctx.Header("Access-Control-Allow-Origin", "*")
	ctx.JSON(
		200,
		gin.H{
			"message": "Post are fetched",
			"posts":   userViewPost,
			"next":    nextPage,
		},
	)

}

func (p *PostController) GetPostByID(ctx *gin.Context) {

	postID := ctx.Query("id")

	if postID == "" {
		fmt.Println("Error: Post ID is required")
		ctx.JSON(400, gin.H{"error": "Post ID is required"})
		return
	}

	post, err := p.postUseCase.GetPostByID(ctx, postID)

	if err != nil {
		fmt.Println("Error: Failed to get post:", err)
		ctx.JSON(500, gin.H{"error": "Failed to get post " + err.Error()})
		return
	}

	postView, err := p.GetPostWithUsers(ctx, []models.Posts{post})

	if err != nil {
		fmt.Println("Error: Failed to get post (user view):", err)
		ctx.JSON(500, gin.H{"error": "Failed to get post " + err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "Post fetched successfully", "post": postView[0]})

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
	// Collect the files
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
	var post models.Posts
	if err := ctx.ShouldBind(&post); err != nil {
		fmt.Println("Error parsing multipart form:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid or missing form data. Ensure all required fields are provided and correctly formatted.",
			"details": err.Error(),
		})
		return
	}

	post.UserID = obId
	// Increase the maximum memory for multipart form parsing to handle larger files

	files := form.File["files"]
	if len(files) > 3 {
		fmt.Println("You can only upload a maximum of 3 files")
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "No files uploaded",
		})
		return
	}

	if post.Content == "" {
		fmt.Println("Content is required")
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Content is required",
		})
		return
	}

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
	// TODO : Implement the data storage
	urls, err := p.storage.UploadFile(files)

	if err != nil {
		fmt.Println("Failed to upload files:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to upload files",
			"details": err.Error(),
		})
		return
	}

	post.PostAttachments = urls

	uploadedPost, err := p.postUseCase.CreatePost(ctx, post)

	if err != nil {
		p.storage.DeleteFile(urls) // Clean up uploaded files if creation fails
		fmt.Println("Failed to create post:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create post",
			"details": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Post created succef mobile clients fail silentlyssfully",
		"post":    uploadedPost,
	})

}

func (p *PostController) VerifyPost(ctx *gin.Context) {
	postID := ctx.Query("id")
	if postID == "" {
		fmt.Println("Error: Post ID is required")
		ctx.JSON(400, gin.H{"error": "Post ID is required"})
		return
	}

	postIDPrimitive, err := primitive.ObjectIDFromHex(postID)
	if err != nil {
		fmt.Println("Error: Invalid Post ID format:", err)
		ctx.JSON(400, gin.H{"error": "Invalid Post ID format"})
		return
	}

	err = p.postUseCase.VerifyPosts(ctx, postIDPrimitive)
	if err != nil {
		fmt.Println("Error: Failed to verify post:", err)
		ctx.JSON(500, gin.H{"error": "Failed to verify post " + err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "Post verified successfully"})
}

func (p *PostController) RemoveUnverifiedPost(ctx *gin.Context) {
	postID := ctx.Query("id")
	if postID == "" {
		fmt.Println("Error: Post ID is required")
		ctx.JSON(400, gin.H{"error": "Post ID is required"})
		return
	}

	postIDPrimitive, err := primitive.ObjectIDFromHex(postID)
	if err != nil {
		fmt.Println("Error: Invalid Post ID format:", err)
		ctx.JSON(400, gin.H{"error": "Invalid Post ID format"})
		return
	}

	err = p.postUseCase.RemoveUnverifiedPost(ctx, postIDPrimitive)

	if err != nil {
		fmt.Println("Error: Failed to delete post:", err)
		ctx.JSON(500, gin.H{"error": "Failed to delete post " + err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "Post removed successfully"})
}

func (p *PostController) UpdatePost(ctx *gin.Context) {
	var post models.Posts
	if err := ctx.ShouldBind(&post); err != nil {
		fmt.Println("Error binding post data:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid or missing form data. Ensure all required fields are provided and correctly formatted.",
			"details": err.Error(),
		})
		return
	}

	postID := ctx.Param("id")
	if postID == "" {
		fmt.Println("Error: Post ID is required")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Post ID is required"})
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

	userIDPrimitive, err := primitive.ObjectIDFromHex(userIDStr)

	if err != nil {
		fmt.Println("Error: Cannot work with the id:", err)
		ctx.JSON(
			500, gin.H{
				"error": "Cannot work with the id",
			},
		)
		return
	}
	if postID != "" {
		postIDPrimitive, err := primitive.ObjectIDFromHex(postID)
		if err != nil {
			fmt.Println("Error: Invalid Post ID format:", err)
			ctx.JSON(400, gin.H{"error": "Invalid Post ID format"})
			return
		}
		post.ID = postIDPrimitive
	} else {
		fmt.Println("Error: Post ID is required")
		ctx.JSON(400, gin.H{"error": "Post ID is required"})
		return
	}

	post.UserID = userIDPrimitive
	post, err = p.postUseCase.UpdatePost(ctx, post)

	if err != nil {
		fmt.Println("Error: Failed to update post:", err)
		ctx.JSON(500, gin.H{"error": "Failed to get post " + err.Error()})
		return
	}

	postView, err := p.GetPostWithUsers(ctx, []models.Posts{post})

	if err != nil {
		fmt.Println("Error: Failed to get post (user view):", err)
		ctx.JSON(500, gin.H{"error": "Failed to get post " + err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "Post updated successfully", "post": postView[0]})

}

func (p *PostController) DeletePost(ctx *gin.Context) {

	postID := ctx.Query("id")

	if postID == "" {
		fmt.Println("Error: Post ID is required")
		ctx.JSON(400, gin.H{"error": "Post ID is required"})
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

	err := p.postUseCase.DeletePost(ctx, userIDStr, postID)

	if err != nil {
		fmt.Println("Error: Failed to delete post:", err)
		ctx.JSON(500, gin.H{"error": "Failed to delete post " + err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"message": "Post deleted successfully"})

}

func (p *PostController) GetMyPosts(ctx *gin.Context) {
	pageStr := ctx.Query("page")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		fmt.Println("Error: Invalid page number:", err)
		ctx.JSON(400, gin.H{"error": "Invalid page number"})
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

	posts, err := p.postUseCase.GetPostsByUserID(ctx, userIDStr, page)
	if err != nil {
		fmt.Println("Error: Failed to get posts:", err)
		ctx.JSON(500, gin.H{"error": "Failed to get posts" + err.Error()})
		return
	}

	nextPage := len(posts) > repository.Pagesize

	postViews, err := p.GetPostWithUsers(ctx, posts[:min(len(posts), repository.Pagesize)])
	if err != nil {
		fmt.Println("Error: Failed to get posts (user view):", err)
		ctx.JSON(500, gin.H{"error": "Failed to get posts " + err.Error()})
		return
	}

	ctx.JSON(200, gin.H{
		"posts": postViews,
		"page":  page,
		"next":  nextPage,
	})
}

func (p *PostController) GetPostsByUserID(ctx *gin.Context) {
	userID := ctx.Query("id")
	pageStr := ctx.Query("page")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		fmt.Println("Error: Invalid page number:", err)
		ctx.JSON(400, gin.H{"error": "Invalid page number"})
		return
	}

	posts, err := p.postUseCase.GetPostsByUserID(ctx, userID, page)
	if err != nil {
		fmt.Println("Error: Failed to get posts:", err)
		ctx.JSON(500, gin.H{"error": "Failed to get posts " + err.Error()})
		return
	}

	nextPage := len(posts) > repository.Pagesize

	postViews, err := p.GetPostWithUsers(ctx, posts[:min(len(posts), repository.Pagesize)])

	if err != nil {
		fmt.Println("Error: Failed to get posts (user view):", err)
		ctx.JSON(500, gin.H{"error": "Failed to get posts " + err.Error()})
		return
	}

	ctx.JSON(200, gin.H{
		"posts": postViews,
		"page":  page,
		"next":  nextPage,
	})
}

func (p *PostController) GetUnverifiedPosts(ctx *gin.Context) {
	pageStr := ctx.Query("page")
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		fmt.Println("Error: Invalid page number:", err)
		ctx.JSON(400, gin.H{"error": "Invalid page number"})
		return
	}

	posts, err := p.postUseCase.GetUnverifiedPosts(ctx, page)
	if err != nil {
		fmt.Println("Error: Failed to get unverified posts:", err)
		ctx.JSON(500, gin.H{"error": "Failed to get unverified posts " + err.Error()})
		return
	}

	nextPage := len(posts) > repository.Pagesize

	postViews, err := p.GetPostWithUsers(ctx, posts[:min(len(posts), repository.Pagesize)])
	if err != nil {
		fmt.Println("Error: Failed to get unverified posts (user view):", err)
		ctx.JSON(500, gin.H{"error": "Failed to get unverified posts " + err.Error()})
		return
	}

	ctx.JSON(200, gin.H{
		"posts": postViews,
		"next":  nextPage,
	})
}

func (p *PostController) GetPostWithUsers(ctx *gin.Context, posts []models.Posts) ([]models.PostView, error) {
	if len(posts) == 0 {
		return []models.PostView{}, nil
	}
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

	likes, err := p.PostlikeUseCase.CheckListOfLikes(ctx, p.GetPostAndUserPairList(posts))
	if err != nil {
		fmt.Println("Error checking likes:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check likes " + err.Error()})
		return nil, err
	}
	// Pair posts with user info
	postViews := make([]models.PostView, 0, len(posts))
	for _, post := range posts {

		userView, ok := userMap[post.UserID.Hex()]
		if !ok {
			continue // or handle missing user
		}
		thisLiked := false

		for _, like := range likes {
			if like.PostID == post.ID && like.UserID == userView.ID {
				thisLiked = true
				break
			}
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
			Liked:           thisLiked,
			Comments:        post.Comments,
			CreatedAt:       post.CreatedAt,
		})

	}
	return postViews, nil
}

func (p *PostController) GetPostAndUserPairList(post []models.Posts) [][]primitive.ObjectID {
	var listOfLikes [][]primitive.ObjectID
	for _, post := range post {
		listOfLikes = append(listOfLikes, []primitive.ObjectID{post.ID, post.UserID})
	}

	return listOfLikes

}

func (p *PostController) RemoveMyPost(userID primitive.ObjectID, post []models.Posts) ([]models.Posts, error) {
	result := make([]models.Posts, 0)
	for _, post := range post {
		if post.UserID != userID {
			result = append(result, post)
		}
	}
	return result, nil
}
