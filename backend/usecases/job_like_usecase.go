package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type JobLikeUsecase interface {
	CheckListOfLikes(ctx context.Context, pairs [][]primitive.ObjectID) ([]models.Like, error)
	CheckLike(ctx context.Context, postID, userID primitive.ObjectID) (bool, error)
	AddLike(ctx context.Context, postID, userID primitive.ObjectID) error
	RemoveLike(ctx context.Context, postID, userID primitive.ObjectID) error
}

type jobLikeUsecase struct {
	repo repository.JobLikeRepository
}

func NewJobLikeUsecase(repo repository.JobLikeRepository) JobLikeUsecase {
	return &jobLikeUsecase{repo: repo}
}

func (u *jobLikeUsecase) CheckLike(ctx context.Context, postID, userID primitive.ObjectID) (bool, error) {
	return u.repo.CheckLike(ctx, postID, userID)
}

func (u *jobLikeUsecase) AddLike(ctx context.Context, postID, userID primitive.ObjectID) error {
	return u.repo.AddLike(ctx, postID, userID)
}

func (u *jobLikeUsecase) RemoveLike(ctx context.Context, postID, userID primitive.ObjectID) error {
	return u.repo.RemoveLike(ctx, postID, userID)
}
func (u *jobLikeUsecase) CheckListOfLikes(ctx context.Context, pairs [][]primitive.ObjectID) ([]models.Like, error) {
	return u.repo.CheckListOfLikes(ctx, pairs)
}
