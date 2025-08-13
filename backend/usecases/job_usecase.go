package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type JobUsecase interface {
	CreateJob(ctx context.Context, job models.Opportunities) (models.Opportunities, error)
	GetJobs(ctx context.Context) ([]models.Opportunities, error)
	GetJobByID(ctx context.Context, id primitive.ObjectID) (models.Opportunities, error)
	UpdateJob(ctx context.Context, job models.Opportunities) (models.Opportunities, error)
	DeleteJob(ctx context.Context, id primitive.ObjectID) error
	GetRecommendedJobs(ctx context.Context, userDepartmentID primitive.ObjectID, userSchoolID primitive.ObjectID, page int) ([]models.Opportunities, error)
	GetJobsWithListOfId(ctx context.Context, jobIDs []primitive.ObjectID) ([]models.Opportunities, error)
}

type jobUsecase struct {
	jobRepo repository.JobRepository
}

func NewJobUsecase(jobRepo repository.JobRepository) JobUsecase {
	return &jobUsecase{jobRepo: jobRepo}
}

func (u *jobUsecase) GetJobsWithListOfId(ctx context.Context, jobIDs []primitive.ObjectID) ([]models.Opportunities, error) {
	return u.jobRepo.GetJobsWithListOfId(ctx, jobIDs)
}

func (u *jobUsecase) CreateJob(ctx context.Context, job models.Opportunities) (models.Opportunities, error) {
	return u.jobRepo.CreateJob(ctx, job)
}

func (u *jobUsecase) GetJobs(ctx context.Context) ([]models.Opportunities, error) {
	return u.jobRepo.GetJobs(ctx)
}

func (u *jobUsecase) GetJobByID(ctx context.Context, id primitive.ObjectID) (models.Opportunities, error) {
	return u.jobRepo.GetJobByID(ctx, id)
}

func (u *jobUsecase) UpdateJob(ctx context.Context, job models.Opportunities) (models.Opportunities, error) {
	return u.jobRepo.UpdateJob(ctx, job)
}

func (u *jobUsecase) DeleteJob(ctx context.Context, id primitive.ObjectID) error {
	return u.jobRepo.DeleteJob(ctx, id)
}

func (u *jobUsecase) GetRecommendedJobs(ctx context.Context, userDepartmentID primitive.ObjectID, userSchoolID primitive.ObjectID, page int) ([]models.Opportunities, error) {
	return u.jobRepo.GetRecommendedJobs(ctx, userDepartmentID, userSchoolID, page)
}
