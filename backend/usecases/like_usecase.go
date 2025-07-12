package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type LikeUsecase interface {
	CheckListOfLikes(ctx context.Context, pairs [][]primitive.ObjectID) ([]models.Like, error)
	CheckLike(ctx context.Context, postID, userID primitive.ObjectID) (bool, error)
	AddLike(ctx context.Context, postID, userID primitive.ObjectID) error
	RemoveLike(ctx context.Context, postID, userID primitive.ObjectID) error
}

type likeUsecase struct {
	repo repository.LikeRepository
}

func NewLikeUsecase(repo repository.LikeRepository) LikeUsecase {
	return &likeUsecase{repo: repo}
}

func (u *likeUsecase) CheckLike(ctx context.Context, postID, userID primitive.ObjectID) (bool, error) {
	return u.repo.CheckLike(ctx, postID, userID)
}

func (u *likeUsecase) AddLike(ctx context.Context, postID, userID primitive.ObjectID) error {
	return u.repo.AddLike(ctx, postID, userID)
}

func (u *likeUsecase) RemoveLike(ctx context.Context, postID, userID primitive.ObjectID) error {
	return u.repo.RemoveLike(ctx, postID, userID)
}
func (u *likeUsecase) CheckListOfLikes(ctx context.Context, pairs [][]primitive.ObjectID) ([]models.Like, error) {
	return u.repo.CheckListOfLikes(ctx, pairs)
}
