package controller

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ReportController struct {
	reportUsecase usecases.ReportUseCase
	userUsecase   usecases.UserUseCase
	postUsecase   usecases.PostUseCase
	jobUseCase    usecases.JobUsecase
}

func NewReportController(reportUsecase usecases.ReportUseCase, userUsecase usecases.UserUseCase, postUsecase usecases.PostUseCase, jobUseCase usecases.JobUsecase) *ReportController {
	return &ReportController{
		reportUsecase: reportUsecase,
		userUsecase:   userUsecase,
		postUsecase:   postUsecase,
		jobUseCase:    jobUseCase,
	}
}

func (p *ReportController) ReportPost(ctx *gin.Context) {
	var report models.Report

	if err := ctx.ShouldBindJSON(&report); err != nil {
		fmt.Println("Error binding report data:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid or missing report data. Ensure all required fields are provided and correctly formatted.",
			"details": err.Error(),
		})
		return
	}

	report.ReportedBy, _ = primitive.ObjectIDFromHex(ctx.GetString("user_id"))
	report.CreatedAt = time.Now()
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
	report.ReportedBy = userIDPrimitive
	result, err := p.reportUsecase.ReportPost(ctx, report)
	if err != nil {
		fmt.Println("Error reporting post:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to report post",
			"details": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Post reported successfully",
		"report":  result,
	})
}

func (p *ReportController) ReportJob(ctx *gin.Context) {
	var report models.Report

	if err := ctx.ShouldBindJSON(&report); err != nil {
		fmt.Println("Error binding report data:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid or missing report data. Ensure all required fields are provided and correctly formatted.",
			"details": err.Error(),
		})
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
	report.ReportedBy = userIDPrimitive

	if report.ReportedPostID.IsZero() {
		fmt.Println("Error: ReportedPostID is required")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ReportedPostID is required"})
		return
	}

	if report.Reason == "" {
		fmt.Println("Error: Reason is required")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Reason is required"})
		return
	}

	_, err = p.reportUsecase.ReportJob(ctx, report)
	if err != nil {
		fmt.Println("Error reporting job:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to report job",
			"details": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Job reported successfully",
	})
}

func (p *ReportController) GetReportAnalytics(ctx *gin.Context) {
	report, err := p.reportUsecase.GetReportAnalytics(ctx)

	if err != nil {
		fmt.Println("Error fetching report analytics:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch report analytics",
			"details": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"reports": report,
	})
}

func (p *ReportController) TakeActionOnReport(ctx *gin.Context) {
	var action models.ReportAction

	if err := ctx.ShouldBindJSON(&action); err != nil {
		fmt.Println("Error binding action data:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid or missing action data. Ensure all required fields are provided and correctly formatted.",
			"details": err.Error(),
		})
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
	if action.Description == "" {
		fmt.Println("Error: Action description is required")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Action description is required"})
		return
	}
	action.PerformedBy = userIDPrimitive

	if action.ReportID.IsZero() {
		fmt.Println("Error: ReportID is required")
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ReportID is required"})
		return
	}

	err = p.reportUsecase.TakeActionOnReport(ctx, action.ReportID, action)
	if err != nil {
		fmt.Println("Error taking action on report:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to take action on report",
			"details": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Action taken on report successfully",
		"action":  action,
	})

}

func (p *ReportController) GetReportedJobs(ctx *gin.Context) {
	pageStr := ctx.Query("page")
	if pageStr == "" {
		pageStr = "1" // Default to page 1 if not provided
	}

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		fmt.Println("Invalid page number:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid page number",
		})
		return
	}
	reports, err := p.reportUsecase.GetReportedJobs(ctx, page)

	if err != nil {
		fmt.Println("Error fetching reported jobs:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch reported jobs",
			"details": err.Error(),
		})
		return
	}
	next := len(reports) > repository.Pagesize
	reports = reports[:min(len(reports), repository.Pagesize)]
	reportForView, err := p.prepareReportsForViewJobs(ctx, reports)
	if err != nil {
		fmt.Println("Error preparing reports for view:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to prepare reports for view",
			"details": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"reports": reportForView,
		"next":    next,
	})
}

func (p *ReportController) GetReportedPosts(ctx *gin.Context) {
	pageStr := ctx.Query("page")
	if pageStr == "" {
		pageStr = "1" // Default to page 1 if not provided
	}
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		fmt.Println("Invalid page number:", err)
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid page number",
		})
		return
	}
	reports, err := p.reportUsecase.GetReportedPosts(ctx, page)

	if err != nil {
		fmt.Println("Error fetching reported posts:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to fetch reported posts",
			"details": err.Error(),
		})
		return
	}
	next := len(reports) > repository.Pagesize
	reports = reports[:min(len(reports), repository.Pagesize)]

	reportForView, err := p.prepareReportsForView(ctx, reports)
	if err != nil {
		fmt.Println("Error preparing reports for view:", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to prepare reports for view",
			"details": err.Error(),
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"reports": reportForView,
		"next":    next,
	})
}

func (p *ReportController) prepareReportsForView(ctx *gin.Context, reports []models.Report) ([]models.ReportView, error) {
	// get the list of posts
	posts_map := map[primitive.ObjectID]models.PostView{}
	posts_list := []primitive.ObjectID{}
	users_map := map[primitive.ObjectID]models.UserView{}
	users_list := []primitive.ObjectID{}
	for _, report := range reports {
		posts_map[report.ReportedPostID] = models.PostView{}
		posts_list = append(posts_list, report.ReportedPostID)
		users_map[report.ReportedBy] = models.UserView{}
		users_list = append(users_list, report.ReportedBy)
		if report.ReviewedBy != nil {
			users_map[*report.ReviewedBy] = models.UserView{}
			users_list = append(users_list, *report.ReviewedBy)
		}
	}

	posts, err := p.postUsecase.GetPostsWithListOfId(ctx, posts_list)
	if err != nil {
		fmt.Println("Error fetching posts for reports:", err)
		return nil, err
	}
	for _, post := range posts {
		users_map[post.UserID] = models.UserView{}
		users_list = append(users_list, post.UserID)
	}

	users, err := p.userUsecase.GetListOfUsers(ctx, users_list)
	if err != nil {
		fmt.Println("Error fetching users for reports:", err)
		return nil, err
	}

	for _, user := range users {
		users_map[user.ID] = user
	}

	var postView models.PostView
	for _, post := range posts {
		postView = models.PostView{
			ID:              post.ID,
			UserID:          users_map[post.UserID],
			Content:         post.Content,
			PostAttachments: post.PostAttachments,
			IsValidated:     post.IsValidated,
			IsAnnouncement:  post.IsAnnouncement,
			IsFlagged:       post.IsFlagged,
			Likes:           post.Likes,
			Liked:           false,
			Comments:        post.Comments,
			CreatedAt:       post.CreatedAt,
		}
		posts_map[post.ID] = postView
	}

	listOfReports := []models.ReportView{}
	for _, report := range reports {
		var r models.ReportView
		r.ID = report.ID
		r.Reason = report.Reason
		r.Reviewed = report.Reviewed
		r.ReportedBy = users_map[report.ReportedBy]
		r.ReportedPost = posts_map[report.ReportedPostID]
		r.Reviewed = report.Reviewed
		r.CreatedAt = report.CreatedAt
		listOfReports = append(listOfReports, r)
	}

	return listOfReports, nil

}

func (p *ReportController) prepareReportsForViewJobs(ctx *gin.Context, reports []models.Report) ([]models.ReportViewJob, error) {
	// get the list of posts
	jobs_map := map[primitive.ObjectID]models.OpportunitiesView{}
	jobs_list := []primitive.ObjectID{}
	users_map := map[primitive.ObjectID]models.UserView{}
	users_list := []primitive.ObjectID{}
	for _, report := range reports {
		jobs_map[report.ReportedPostID] = models.OpportunitiesView{}
		jobs_list = append(jobs_list, report.ReportedPostID)
		users_map[report.ReportedBy] = models.UserView{}
		users_list = append(users_list, report.ReportedBy)
		if report.ReviewedBy != nil {
			users_map[*report.ReviewedBy] = models.UserView{}
			users_list = append(users_list, *report.ReviewedBy)
		}
	}

	jobs, err := p.jobUseCase.GetJobsWithListOfId(ctx, jobs_list)
	if err != nil {
		fmt.Println("Error fetching posts for reports:", err)
		return nil, err
	}
	for _, job := range jobs {
		users_map[job.PostedBy] = models.UserView{}
		users_list = append(users_list, job.PostedBy)
	}

	users, err := p.userUsecase.GetListOfUsers(ctx, users_list)
	if err != nil {
		fmt.Println("Error fetching users for reports:", err)
		return nil, err
	}

	for _, user := range users {
		users_map[user.ID] = user
	}

	var jobView models.OpportunitiesView
	for _, job := range jobs {
		jobView = models.OpportunitiesView{
			ID:          job.ID,
			PostedBy:    users_map[job.PostedBy],
			Title:       job.Title,
			Description: job.Description,
			Like:        job.Like,
			Liked:       false,
			Link:        job.Link,
			CreatedAt:   job.CreatedAt,
		}
		jobs_map[job.ID] = jobView
	}

	listOfReports := []models.ReportViewJob{}
	for _, report := range reports {
		var r models.ReportViewJob
		r.ID = report.ID
		r.Reason = report.Reason
		r.Reviewed = report.Reviewed
		r.ReportedBy = users_map[report.ReportedBy]
		r.ReportedJob = jobs_map[report.ReportedPostID]
		r.Reviewed = report.Reviewed
		r.CreatedAt = report.CreatedAt
		listOfReports = append(listOfReports, r)
	}

	return listOfReports, nil

}
