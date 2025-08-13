package repository

import (
	"context"
	"errors"
	"sort"
	"time"

	"github.com/chera-mihiretu/IKnow/domain/constants"
	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ReportRepository interface {
	ReportPost(ctx context.Context, report models.Report) (models.Report, error)
	ReportJob(ctx context.Context, report models.Report) (models.Report, error)
	GetReportedPosts(ctx context.Context, page int) ([]models.Report, error)
	GetReportedJobs(ctx context.Context, page int) ([]models.Report, error)

	GetReportAnalytics(ctx context.Context) (models.ReportAnalytics, error)

	TakeActionOnReport(ctx context.Context, reportID primitive.ObjectID, action models.ReportAction) error

	HideActionOnReport(ctx context.Context, reportID primitive.ObjectID, action models.ReportAction) error
	DeleteActionOnReport(ctx context.Context, reportID primitive.ObjectID, action models.ReportAction) error
	IgnoreActionOnReport(ctx context.Context, reportID primitive.ObjectID, action models.ReportAction) error
}

type reportRepository struct {
	postCollection   *mongo.Collection
	jobCollection    *mongo.Collection
	actionCollection *mongo.Collection
	reportCollection *mongo.Collection
}

func NewReportRepository(db *mongo.Database) ReportRepository {
	return &reportRepository{
		postCollection:   db.Collection("posts"),
		jobCollection:    db.Collection("jobs"),
		actionCollection: db.Collection("actions"),
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
	report.Type = constants.ReportTypePost

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

func (r *reportRepository) GetReportedJobs(ctx context.Context, page int) ([]models.Report, error) {
	limit := ConnectPageSize
	skip := (page - 1) * limit

	filter := bson.M{"reviewed": false, "type": constants.ReportTypeJob}
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

func (r *reportRepository) GetReportedPosts(ctx context.Context, page int) ([]models.Report, error) {

	limit := ConnectPageSize
	skip := (page - 1) * limit

	filter := bson.M{"reviewed": false, "type": constants.ReportTypePost}
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

func (r *reportRepository) TakeActionOnReport(ctx context.Context, reportID primitive.ObjectID, action models.ReportAction) error {

	switch action.Action {

	case constants.ActionTypeDelete:
		// insert the action into the action database
		return r.DeleteActionOnReport(ctx, reportID, action)
	case constants.ActionTypeHide:
		// insert the action into the action database
		return r.HideActionOnReport(ctx, reportID, action)

	case constants.ActionTypeIgnore:
		// insert the action into the action database
		return r.IgnoreActionOnReport(ctx, reportID, action)

	default:
		return errors.New("invalid action type")
	}

}

func (r *reportRepository) HideActionOnReport(ctx context.Context, reportID primitive.ObjectID, action models.ReportAction) error {
	var report models.Report
	err := r.reportCollection.FindOne(ctx, bson.M{"_id": reportID}).Decode(&report)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return errors.New("report not found")
		}
	}

	action.CreatedAt = time.Now()
	action.ID = primitive.NewObjectID()
	_, err = r.actionCollection.InsertOne(ctx, action)
	if err != nil {
		return err
	}
	// hide the post or job based on the report type
	switch report.Type {
	case constants.ReportTypePost:
		_, err = r.postCollection.UpdateOne(ctx, bson.M{"_id": report.ReportedPostID}, bson.M{
			"$set": bson.M{
				"is_flagged": true,
			},
		})
		if err != nil {
			return err
		}
	case constants.ReportTypeJob:
		_, err = r.jobCollection.UpdateOne(ctx, bson.M{"_id": report.ReportedPostID}, bson.M{
			"$set": bson.M{
				"is_flagged": true,
			},
		})
		if err != nil {
			return err
		}
	default:
		return errors.New("invalid report type")
	}
	// update the report to mark it as reviewed
	report.Reviewed = true
	report.ReviewedBy = &action.PerformedBy
	report.ReviewedAt = &action.CreatedAt
	update, err := r.reportCollection.UpdateOne(ctx, bson.M{"_id": report.ID}, bson.M{
		"$set": bson.M{
			"reviewed":    true,
			"reviewed_by": action.PerformedBy,
			"reviewed_at": action.CreatedAt,
		},
	})
	if err != nil || update.MatchedCount == 0 {
		if err != nil {
			return err
		}
		return errors.New("report not found or already reviewed")
	}
	// TODO: notify the user the post has been hidden
	return nil
}

func (r *reportRepository) DeleteActionOnReport(ctx context.Context, reportID primitive.ObjectID, action models.ReportAction) error {
	var report models.Report
	err := r.reportCollection.FindOne(ctx, bson.M{"_id": reportID}).Decode(&report)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return errors.New("report not found")
		}
		return err
	}
	action.ID = primitive.NewObjectID()
	action.CreatedAt = time.Now()
	_, err = r.actionCollection.InsertOne(ctx, action)

	if err != nil {
		return err
	}

	report.Reviewed = true

	update, err := r.reportCollection.UpdateOne(ctx, bson.M{"_id": reportID}, bson.M{
		"$set": bson.M{
			"reviewed":    true,
			"reviewed_by": action.PerformedBy,
			"reviewed_at": time.Now(),
		},
	})

	if err != nil || update.MatchedCount == 0 {
		if err != nil {
			return err
		}
		return errors.New("report not found or already reviewed")
	}

	switch report.Type {
	case constants.ReportTypeJob:
		eff, err := r.jobCollection.DeleteOne(ctx, bson.M{"_id": report.ReportedPostID})

		if err != nil || eff.DeletedCount == 0 {
			if err != nil {
				return err
			}
			return errors.New("job not found or already deleted")
		}
	case constants.ReportTypePost:
		eff, err := r.postCollection.DeleteOne(ctx, bson.M{"_id": report.ReportedPostID})

		if err != nil || eff.DeletedCount == 0 {
			if err != nil {
				return err
			}
			return errors.New("post not found or already deleted")
		}
	default:
		return errors.New("invalid report type")
	}
	// TODO : send users notification that their post has been deleted
	return nil
}

func (r *reportRepository) IgnoreActionOnReport(ctx context.Context, reportID primitive.ObjectID, action models.ReportAction) error {
	var report models.Report
	err := r.reportCollection.FindOne(ctx, bson.M{"_id": reportID}).Decode(&report)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return errors.New("report not found")
		}
		return err
	}
	action.ID = primitive.NewObjectID()
	action.CreatedAt = time.Now()
	_, err = r.actionCollection.InsertOne(ctx, action)

	if err != nil {
		return err
	}

	report.Reviewed = true

	update, err := r.reportCollection.UpdateOne(ctx, bson.M{"_id": reportID}, bson.M{
		"$set": bson.M{
			"reviewed":    true,
			"reviewed_by": action.PerformedBy,
			"reviewed_at": time.Now(),
		},
	})

	if err != nil || update.MatchedCount == 0 {
		if err != nil {
			return err
		}
		return errors.New("report not found or already reviewed")
	}

	return nil

}

func (r *reportRepository) ReportJob(ctx context.Context, report models.Report) (models.Report, error) {
	if report.Reason == "" {
		return models.Report{}, errors.New("report must have a reason")
	}

	filter := bson.M{
		"reported_by":      report.ReportedBy,
		"reported_post_id": report.ReportedPostID,
	}

	existingReport := r.reportCollection.FindOne(ctx, filter)
	if existingReport.Err() == nil {
		return models.Report{}, errors.New("you have already reported this job")
	}

	report.CreatedAt = time.Now()
	report.Reviewed = false
	report.Type = constants.ReportTypeJob

	var job models.Opportunities
	err := r.jobCollection.FindOne(ctx, bson.M{"_id": report.ReportedPostID}).Decode(&job)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return models.Report{}, errors.New("the job is not found")
		}
		return models.Report{}, err
	}

	if job.PostedBy == report.ReportedBy {
		return models.Report{}, errors.New("you cannot report your own job")
	}

	_, err = r.reportCollection.InsertOne(ctx, report)
	if err != nil {
		return models.Report{}, err
	}
	return report, nil
}
