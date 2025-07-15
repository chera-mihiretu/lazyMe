package controller

import (
	"context"
	"net/http"
	"strconv"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CommentController struct {
	usecase      usecases.CommentUsecase
	usersUsecase usecases.UserUseCase
}

func NewCommentController(usecase usecases.CommentUsecase, users usecases.UserUseCase) *CommentController {
	return &CommentController{usecase: usecase, usersUsecase: users}
}

func (c *CommentController) GetComments(ctx *gin.Context) {
	postIDStr := ctx.Query("post_id")
	postID, err := primitive.ObjectIDFromHex(postIDStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid post ID" + err.Error()})
		return
	}

	page := ctx.Query("page")
	if page == "" {
		page = "1"

	}

	pageInt, err := strconv.Atoi(page)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
		return
	}

	comments, err := c.usecase.GetComments(ctx, postID, pageInt)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	actualComments, err := c.GetCommentsWithUsers(ctx, comments)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"comments": actualComments, "page": pageInt})
}

func (c *CommentController) AddComment(ctx *gin.Context) {
	userIDVal, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userIDVal.(string)
	if !ok {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID type"})
		return
	}
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID format"})
		return
	}
	var req models.Comments
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.PostID.IsZero() {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Post ID is required"})
		return
	}
	req.UserID = userID
	req.ReplyCount = 0
	req.Like = 0

	comment, err := c.usecase.AddComment(ctx, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{"comment": comment})
}

func (c *CommentController) DeleteComment(ctx *gin.Context) {
	userIDVal, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userIDVal.(string)
	if !ok {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID type"})
		return
	}
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID format"})
		return
	}
	commentIDStr := ctx.Param("comment_id")
	commentID, err := primitive.ObjectIDFromHex(commentIDStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID"})
		return
	}
	if err := c.usecase.DeleteComment(ctx, commentID, userID); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Comment deleted"})
}

func (c *CommentController) EditComment(ctx *gin.Context) {
	userIDVal, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userIDVal.(string)
	if !ok {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID type"})
		return
	}
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID format"})
		return
	}
	commentIDStr := ctx.Param("comment_id")
	commentID, err := primitive.ObjectIDFromHex(commentIDStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID"})
		return
	}
	var req struct {
		Content string `json:"content"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	comment, err := c.usecase.EditComment(ctx, commentID, userID, req.Content)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"comment": comment})
}

func (c *CommentController) GetReplies(ctx *gin.Context) {
	commentIDStr := ctx.Query("comment_id")
	if commentIDStr == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Comment ID is required"})
		return
	}

	commentID, err := primitive.ObjectIDFromHex(commentIDStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid comment ID format"})
		return
	}

	page := ctx.Query("page")
	if page == "" {
		page = "1"
	}

	pageInt, err := strconv.Atoi(page)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
		return
	}

	replies, err := c.usecase.GetReply(ctx, commentID, pageInt)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	actualReplies, err := c.GetCommentsWithUsers(ctx, replies)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"replies": actualReplies, "page": pageInt})
}

func (c *CommentController) AddReply(ctx *gin.Context) {
	userIDVal, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userIDVal.(string)
	if !ok {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID type"})
		return
	}
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID format"})
		return
	}
	var req models.Comments
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if req.PostID.IsZero() || req.ParentCommentID.IsZero() {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Post ID and Comment ID are required"})
		return
	}
	req.UserID = userID
	req.ReplyCount = 0 // Replies do not have replies
	req.Like = 0

	reply, err := c.usecase.AddReply(ctx, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{"reply": reply})
}

func (c *CommentController) GetCommentsWithUsers(ctx context.Context, comments []models.Comments) ([]models.CommentsView, error) {
	userIDSet := make(map[string]struct{})
	for _, comment := range comments {
		userIDSet[comment.UserID.Hex()] = struct{}{}
	}
	userIDs := make([]primitive.ObjectID, 0, len(userIDSet))
	for id := range userIDSet {
		objID, err := primitive.ObjectIDFromHex(id)
		if err == nil {
			userIDs = append(userIDs, objID)
		}
	}

	// Fetch user info
	users, err := c.usersUsecase.GetListOfUsers(ctx, userIDs)
	if err != nil {
		return []models.CommentsView{}, err
	}
	userMap := make(map[string]models.UserView)
	for _, user := range users {
		userMap[user.ID.Hex()] = user
	}

	// Pair comments with user info
	commentViews := make([]models.CommentsView, 0, len(comments))
	for _, comment := range comments {
		userView, ok := userMap[comment.UserID.Hex()]
		if !ok {
			continue // or handle missing user
		}
		commentViews = append(commentViews, models.CommentsView{
			ID:         comment.ID,
			PostID:     comment.PostID,
			UserID:     userView,
			ReplyCount: comment.ReplyCount,
			Like:       comment.Like,
			Content:    comment.Content,
			CreatedAt:  comment.CreatedAt,
		})
	}

	return commentViews, nil
}
