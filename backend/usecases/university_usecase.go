package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UniversityUsecase interface {
	GetUniversities(ctx context.Context) ([]models.University, error)
	GetUniversityByID(ctx context.Context, id primitive.ObjectID) (models.University, error)
	CreateUniversity(ctx context.Context, university models.University) (models.University, error)
	UpdateUniversity(ctx context.Context, university models.University) (models.University, error)
	DeleteUniversity(ctx context.Context, id primitive.ObjectID, userID primitive.ObjectID) error
}

type universityUsecase struct {
	universityRepo repository.UniversityRepository
}

func NewUniversityUsecase(repo repository.UniversityRepository) UniversityUsecase {
	return &universityUsecase{universityRepo: repo}
}

func (u *universityUsecase) GetUniversities(ctx context.Context) ([]models.University, error) {
	return u.universityRepo.GetUniversities(ctx)
}

func (u *universityUsecase) GetUniversityByID(ctx context.Context, id primitive.ObjectID) (models.University, error) {
	return u.universityRepo.GetUniversityByID(ctx, id)
}

func (u *universityUsecase) CreateUniversity(ctx context.Context, university models.University) (models.University, error) {
	return u.universityRepo.CreateUniversity(ctx, university)
}

func (u *universityUsecase) UpdateUniversity(ctx context.Context, university models.University) (models.University, error) {
	return u.universityRepo.UpdateUniversity(ctx, university)
}
func (u *universityUsecase) DeleteUniversity(ctx context.Context, id, userID primitive.ObjectID) error {
	return u.universityRepo.DeleteUniversity(ctx, id, userID)
}
