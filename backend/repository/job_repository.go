package repository

import (
	"context"
	"time"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type JobRepository interface {
	CreateJob(ctx context.Context, job models.Opportunities) (models.Opportunities, error)
	GetJobs(ctx context.Context) ([]models.Opportunities, error)
	GetJobByID(ctx context.Context, id primitive.ObjectID) (models.Opportunities, error)
	UpdateJob(ctx context.Context, job models.Opportunities) (models.Opportunities, error)
	DeleteJob(ctx context.Context, id primitive.ObjectID) error
	GetRecommendedJobs(ctx context.Context, userDepartmentID primitive.ObjectID) ([]models.Opportunities, error)
}

type jobRepository struct {
	jobs *mongo.Collection
}

func NewJobRepository(db *mongo.Database) JobRepository {
	return &jobRepository{
		jobs: db.Collection("jobs"),
	}
}

func (r *jobRepository) CreateJob(ctx context.Context, job models.Opportunities) (models.Opportunities, error) {
	job.ID = primitive.NewObjectID()
	job.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	_, err := r.jobs.InsertOne(ctx, job)
	if err != nil {
		return models.Opportunities{}, err
	}
	return job, nil
}

func (r *jobRepository) GetJobs(ctx context.Context) ([]models.Opportunities, error) {
	var jobs []models.Opportunities
	cursor, err := r.jobs.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var job models.Opportunities
		if err := cursor.Decode(&job); err != nil {
			return nil, err
		}
		jobs = append(jobs, job)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return jobs, nil
}

func (r *jobRepository) GetJobByID(ctx context.Context, id primitive.ObjectID) (models.Opportunities, error) {
	var job models.Opportunities
	err := r.jobs.FindOne(ctx, bson.M{"_id": id}).Decode(&job)
	if err != nil {
		return models.Opportunities{}, err
	}
	return job, nil
}

func (r *jobRepository) UpdateJob(ctx context.Context, job models.Opportunities) (models.Opportunities, error) {
	update := bson.M{
		"$set": bson.M{
			"title":          job.Title,
			"description":    job.Description,
			"link":           job.Link,
			"type":           job.Type,
			"department_ids": job.DepartmentIDs,
			"like":           job.Like,
		},
	}
	res, err := r.jobs.UpdateOne(ctx, bson.M{"_id": job.ID}, update)
	if err != nil {
		return models.Opportunities{}, err
	}
	if res.MatchedCount == 0 {
		return models.Opportunities{}, mongo.ErrNoDocuments
	}
	return job, nil
}

func (r *jobRepository) DeleteJob(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.jobs.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return err
	}
	if res.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}
	return nil
}

// GetRecommendedJobs prioritizes jobs by department match and likes
func (r *jobRepository) GetRecommendedJobs(ctx context.Context, userDepartmentID primitive.ObjectID) ([]models.Opportunities, error) {
	pipeline := mongo.Pipeline{
		bson.D{{Key: "$addFields", Value: bson.D{
			{Key: "priority", Value: bson.D{
				{Key: "$cond", Value: bson.A{
					bson.D{{Key: "$in", Value: bson.A{userDepartmentID, "$department_ids"}}},
					1,
					2,
				}},
			}},
		}}},
		bson.D{{Key: "$sort", Value: bson.D{
			{Key: "priority", Value: 1},
			{Key: "like", Value: -1},
			{Key: "created_at", Value: -1},
		}}},
	}
	cursor, err := r.jobs.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	var jobs []models.Opportunities
	for cursor.Next(ctx) {
		var job models.Opportunities
		if err := cursor.Decode(&job); err != nil {
			return nil, err
		}
		jobs = append(jobs, job)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return jobs, nil
}
