package controller

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type JobController struct {
	usecase        usecases.JobUsecase
	userUsecase    usecases.UserUseCase
	jobLikeUsecase usecases.JobLikeUsecase
}

func NewJobController(usecase usecases.JobUsecase, users usecases.UserUseCase, jobLike usecases.JobLikeUsecase) *JobController {
	return &JobController{usecase: usecase, userUsecase: users, jobLikeUsecase: jobLike}
}

func (c *JobController) CreateJob(ctx *gin.Context) {
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
	userIDPri, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		fmt.Println("Error: Invalid user ID format:", userIDStr, "Error:", err)
		ctx.JSON(400, gin.H{"error": "Invalid user ID format"})
		return
	}
	var job models.Opportunities
	if err := ctx.ShouldBindJSON(&job); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	job.PostedBy = userIDPri

	if len(job.DepartmentIDs) == 0 || job.Title == "" || job.Description == "" || job.Link == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Department IDs, Title, Description, and Link are required"})
		return
	}

	createdJob, err := c.usecase.CreateJob(ctx, job)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{"job": createdJob})
}

func (c *JobController) GetJobs(ctx *gin.Context) {
	jobs, err := c.usecase.GetJobs(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"jobs": jobs})
}

func (c *JobController) GetJobByID(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job ID"})
		return
	}
	job, err := c.usecase.GetJobByID(ctx, id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"job": job})
}

func (c *JobController) UpdateJob(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job ID"})
		return
	}
	var job models.Opportunities
	if err := ctx.ShouldBindJSON(&job); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	job.ID = id
	updatedJob, err := c.usecase.UpdateJob(ctx, job)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"job": updatedJob})
}

func (c *JobController) DeleteJob(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := primitive.ObjectIDFromHex(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid job ID"})
		return
	}
	if err := c.usecase.DeleteJob(ctx, id); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Job deleted"})
}

func (c *JobController) GetRecommendedJobs(ctx *gin.Context) {
	userID, exist := ctx.Get("user_id")
	if !exist {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID type"})
		return
	}

	user, err := c.userUsecase.GetUserByIdNoneView(ctx, userIDStr)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	pageStr := ctx.Query("page")
	if pageStr == "" {
		pageStr = "1"
	}
	pageInt, err := strconv.Atoi(pageStr)
	if err != nil || pageInt < 1 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
		return
	}

	jobs, err := c.usecase.GetRecommendedJobs(ctx, *user.DepartmentID, *user.SchoolID, pageInt)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	jobsUsers, err := c.AppendUserInfoToJobs(ctx, jobs)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"jobs": jobsUsers, "page": pageInt})
}

func (c *JobController) AppendUserInfoToJobs(ctx *gin.Context, jobs []models.Opportunities) ([]models.OpportunitiesView, error) {

	userIDSet := make(map[string]struct{})

	for _, job := range jobs {
		userIDSet[job.PostedBy.Hex()] = struct{}{}
	}

	userIDs := make([]primitive.ObjectID, 0, len(userIDSet))
	for id := range userIDSet {
		objID, err := primitive.ObjectIDFromHex(id)
		if err == nil {
			userIDs = append(userIDs, objID)
		}
	}

	// Fetch user info
	users, err := c.userUsecase.GetListOfUsers(ctx, userIDs)
	if err != nil {
		return []models.OpportunitiesView{}, err
	}
	userMap := make(map[string]models.UserView)
	for _, user := range users {
		userMap[user.ID.Hex()] = user
	}

	var jobsWithUserInfo []models.OpportunitiesView
	likes, err := c.jobLikeUsecase.CheckListOfLikes(ctx, c.GetPostAndUserPairList(jobs))
	if err != nil {
		return nil, err
	}
	for _, job := range jobs {
		userView, ok := userMap[job.PostedBy.Hex()]
		if !ok {
			continue // Skip if user info is not found
		}
		liked := false
		for _, like := range likes {
			if like.PostID == job.ID && like.UserID == userView.ID {
				liked = true
				break
			}
		}
		jobView := models.OpportunitiesView{
			ID:            job.ID,
			DepartmentIDs: job.DepartmentIDs,
			Title:         job.Title,
			Like:          job.Like,
			Description:   job.Description,
			Link:          job.Link,
			Liked:         liked,
			Type:          job.Type,
			PostedBy:      userView,
			CreatedAt:     job.CreatedAt,
		}
		jobsWithUserInfo = append(jobsWithUserInfo, jobView)
	}
	return jobsWithUserInfo, nil

}

func (p *JobController) GetPostAndUserPairList(jobs []models.Opportunities) [][]primitive.ObjectID {
	var listOfLikes [][]primitive.ObjectID
	for _, job := range jobs {
		listOfLikes = append(listOfLikes, []primitive.ObjectID{job.ID, job.PostedBy})
	}

	return listOfLikes

}
