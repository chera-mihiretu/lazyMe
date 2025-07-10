package controller

import (
	"net/http"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type JobController struct {
	usecase usecases.JobUsecase
}

func NewJobController(usecase usecases.JobUsecase) *JobController {
	return &JobController{usecase: usecase}
}

func (c *JobController) CreateJob(ctx *gin.Context) {
	var job models.Opportunities
	if err := ctx.ShouldBindJSON(&job); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
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
	departmentIDStr := ctx.Query("department_id")
	departmentID, err := primitive.ObjectIDFromHex(departmentIDStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid department ID"})
		return
	}
	jobs, err := c.usecase.GetRecommendedJobs(ctx, departmentID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"jobs": jobs})
}
