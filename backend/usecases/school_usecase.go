package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SchoolUsecase interface {
	GetSchools(ctx context.Context, universityID primitive.ObjectID, page int) ([]models.School, error)
	GetSchoolByID(ctx context.Context, id primitive.ObjectID) (models.School, error)
	CreateSchool(ctx context.Context, school models.School) (models.School, error)
	UpdateSchool(ctx context.Context, school models.School) (models.School, error)
	DeleteSchool(ctx context.Context, id primitive.ObjectID) error
	GetAllSchools(ctx context.Context, page int) ([]models.School, error)
}

type schoolUsecase struct {
	schoolRepo repository.SchoolRepository
}

func NewSchoolUsecase(repo repository.SchoolRepository) SchoolUsecase {
	return &schoolUsecase{schoolRepo: repo}
}

func (u *schoolUsecase) GetSchools(ctx context.Context, universityID primitive.ObjectID, page int) ([]models.School, error) {
	return u.schoolRepo.GetSchools(ctx, universityID, page)
}

func (u *schoolUsecase) GetSchoolByID(ctx context.Context, id primitive.ObjectID) (models.School, error) {
	return u.schoolRepo.GetSchoolByID(ctx, id)
}

func (u *schoolUsecase) CreateSchool(ctx context.Context, school models.School) (models.School, error) {
	return u.schoolRepo.CreateSchool(ctx, school)
}

func (u *schoolUsecase) UpdateSchool(ctx context.Context, school models.School) (models.School, error) {
	return u.schoolRepo.UpdateSchool(ctx, school)
}

func (u *schoolUsecase) DeleteSchool(ctx context.Context, id primitive.ObjectID) error {
	return u.schoolRepo.DeleteSchool(ctx, id)
}
func (u *schoolUsecase) GetAllSchools(ctx context.Context, page int) ([]models.School, error) {
	return u.schoolRepo.GetAllSchools(ctx, page)
}
