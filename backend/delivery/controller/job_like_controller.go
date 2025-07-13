package controller

import (
	"fmt"
	"net/http"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type JobLikeController struct {
	usecase usecases.JobLikeUsecase
}

func NewJobLikeController(usecase usecases.PostLikeUsecase) *JobLikeController {
	return &JobLikeController{usecase: usecase}
}

// CheckLike checks if a user liked a post
func (c *JobLikeController) CheckLike(ctx *gin.Context) {
	postID, userID, err := c.GetIDs(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	liked, err := c.usecase.CheckLike(ctx, postID, userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"liked": liked})
}

// AddLike adds a like to a post
func (c *JobLikeController) AddLike(ctx *gin.Context) {
	postID, userID, err := c.GetIDs(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	err = c.usecase.AddLike(ctx, postID, userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Like added"})
}

// RemoveLike removes a like from a post
func (c *JobLikeController) RemoveLike(ctx *gin.Context) {
	postID, userID, err := c.GetIDs(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = c.usecase.RemoveLike(ctx, postID, userID)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Like removed"})
}

func (c *JobLikeController) GetIDs(ctx *gin.Context) (primitive.ObjectID, primitive.ObjectID, error) {

	var likeM models.Like

	if err := ctx.ShouldBindJSON(&likeM); err != nil {
		return primitive.NilObjectID, primitive.NilObjectID, err
	}

	userID, exist := ctx.Get("user_id")
	if !exist {
		return primitive.NilObjectID, primitive.NilObjectID, fmt.Errorf("user id not found in context")
	}
	userIDStr, ok := userID.(string)
	if !ok {
		return primitive.NilObjectID, primitive.NilObjectID, fmt.Errorf("invalid user id type")
	}

	userIDPri, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		return primitive.NilObjectID, primitive.NilObjectID, err
	}

	return likeM.PostID, userIDPri, nil
}
