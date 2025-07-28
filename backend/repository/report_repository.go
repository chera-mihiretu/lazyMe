package repository

import (
	"context"
	"errors"
	"sort"
	"time"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ReportRepository interface {
	ReportPost(ctx context.Context, report models.Report) (models.Report, error)
	GetReportedPosts(ctx context.Context, page int) ([]models.Report, error)

	GetReportAnalytics(ctx context.Context) (models.ReportAnalytics, error)
}

type reportRepository struct {
	postCollection   *mongo.Collection
	jobCollection    *mongo.Collection
	reportCollection *mongo.Collection
}

func NewReportRepository(db *mongo.Database) ReportRepository {
	return &reportRepository{
		postCollection:   db.Collection("posts"),
		jobCollection:    db.Collection("jobs"),
		reportCollection: db.Collection("reports"),
	}
}

func (r *reportRepository) ReportPost(ctx context.Context, report models.Report) (models.Report, error) {
	if report.Reason == "" {
		return models.Report{}, errors.New("report must have a reason")
	}

	filter := bson.M{
		"reported_by":      report.ReportedBy,
		"reported_post_id": report.ReportedPostID,
	}

	existingReport := r.reportCollection.FindOne(ctx, filter)
	if existingReport.Err() == nil {
		return models.Report{}, errors.New("you have already reported this post")
	}

	report.CreatedAt = time.Now()
	report.Reviewed = false

	var post models.Posts
	err := r.postCollection.FindOne(ctx, bson.M{"_id": report.ReportedPostID}).Decode(&post)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return models.Report{}, errors.New("the post is not found")
		}
		return models.Report{}, err
	}

	if post.UserID == report.ReportedBy {
		return models.Report{}, errors.New("you cannot report your own post")
	}

	_, err = r.reportCollection.InsertOne(ctx, report)
	if err != nil {
		return models.Report{}, err
	}
	return report, nil
}

func (r *reportRepository) GetReportedPosts(ctx context.Context, page int) ([]models.Report, error) {

	limit := ConnectPageSize
	skip := (page - 1) * limit

	filter := bson.M{"reviewed": false}
	options := options.Find()
	options.SetLimit(int64(limit))
	options.SetSkip(int64(skip))

	cursor, err := r.reportCollection.Find(ctx, filter, options)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var reports []models.Report
	if err = cursor.All(ctx, &reports); err != nil {
		return nil, err
	}

	return reports, nil

}

func (r *reportRepository) GetReportAnalytics(ctx context.Context) (models.ReportAnalytics, error) {
	var analytics models.ReportAnalytics
	now := time.Now()

	// Count all records in the "users" collection
	totalCount, err := r.reportCollection.CountDocuments(ctx, bson.M{})
	if err != nil {
		return models.ReportAnalytics{}, err
	}
	pendingReports, err := r.reportCollection.CountDocuments(ctx, bson.M{"reviewed": false})

	if err != nil {
		return models.ReportAnalytics{}, err
	}
	analytics.TotalReports = int(totalCount)
	analytics.PendingReports = int(pendingReports)
	analytics.ReviewedReports = int(totalCount - pendingReports)

	// Calculate the start and end times for the 7-day range
	startOfRange := now.AddDate(0, 0, -6).Truncate(24 * time.Hour)
	endOfRange := now.Add(24 * time.Hour)

	// Fetch all reports created within the 7-day range
	cursor, err := r.reportCollection.Find(ctx, bson.M{
		"created_at": bson.M{
			"$gte": startOfRange,
			"$lt":  endOfRange,
		},
	})
	if err != nil {
		return models.ReportAnalytics{}, err
	}
	defer cursor.Close(ctx)

	analytics.ReportEachDay = make([]int64, 7)

	// Sort reports by their creation date
	var reports []models.Report
	for cursor.Next(ctx) {
		var report models.Report
		if err := cursor.Decode(&report); err != nil {
			return models.ReportAnalytics{}, err
		}
		reports = append(reports, report)
	}
	if err := cursor.Err(); err != nil {
		return models.ReportAnalytics{}, err
	}

	sort.Slice(reports, func(i, j int) bool {
		return reports[i].CreatedAt.Before(reports[j].CreatedAt)
	})

	// Initialize variables
	start := 0
	for i := 0; i < len(reports); i++ {
		// Check if the current report is out of the date span
		if reports[i].CreatedAt.After(reports[start].CreatedAt.Add(24 * time.Hour)) {
			// Count the number of reports in the span
			dayIndex := int(reports[start].CreatedAt.Sub(startOfRange).Hours() / 24)
			if dayIndex >= 0 && dayIndex < 7 {
				analytics.ReportEachDay[dayIndex] = int64(i - start)
			}
			// Move the start pointer to the current index
			start = i
		}
	}

	// Handle the remaining reports
	if start < len(reports) {
		dayIndex := int(reports[start].CreatedAt.Sub(startOfRange).Hours() / 24)
		if dayIndex >= 0 && dayIndex < 7 {
			analytics.ReportEachDay[dayIndex] = int64(len(reports) - start)
		}
	}

	return analytics, nil
}
