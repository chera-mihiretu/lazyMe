package repository

import (
	"context"
	"time"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type JobRepository interface {
	CreateJob(ctx context.Context, job models.Opportunities) (models.Opportunities, error)
	GetJobs(ctx context.Context) ([]models.Opportunities, error)
	GetJobByID(ctx context.Context, id primitive.ObjectID) (models.Opportunities, error)
	UpdateJob(ctx context.Context, job models.Opportunities) (models.Opportunities, error)
	DeleteJob(ctx context.Context, id primitive.ObjectID) error
	GetRecommendedJobs(ctx context.Context, userDepartmentID primitive.ObjectID, userSchoolID primitive.ObjectID, page int) ([]models.Opportunities, error)
}

type jobRepository struct {
	jobs           *mongo.Collection
	departmentRepo DepartmentRepository
}

func NewJobRepository(db *mongo.Database,
	departmentRepo DepartmentRepository) JobRepository {
	return &jobRepository{
		jobs:           db.Collection("jobs"),
		departmentRepo: departmentRepo,
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
func (r *jobRepository) GetRecommendedJobs(ctx context.Context, userDepartmentID primitive.ObjectID, userSchoolID primitive.ObjectID, page int) ([]models.Opportunities, error) {
	var departmentIDs []primitive.ObjectID
	if userDepartmentID != primitive.NilObjectID {
		departmentIDs = []primitive.ObjectID{userDepartmentID}
	} else if userSchoolID != primitive.NilObjectID {
		departments, err := r.departmentRepo.GetDepartmentsInTree(ctx, userSchoolID)
		if err != nil {
			return nil, err
		}
		for _, dept := range departments {
			departmentIDs = append(departmentIDs, dept.ID)
		}
		if len(departmentIDs) == 0 {
			return []models.Opportunities{}, nil
		}
	} else {
		return []models.Opportunities{}, nil
	}

	filter := bson.M{"department_ids": bson.M{"$in": departmentIDs}}
	findOptions := options.Find().SetSort(bson.D{{Key: "like", Value: -1}, {Key: "created_at", Value: -1}}).
		SetSkip(int64((page - 1) * 10)).SetLimit(10)
	cursor, err := r.jobs.Find(ctx, filter, findOptions)
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
