package usecases

import (
	"context"
	"errors"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CommentUsecase interface {
	GetComments(ctx context.Context, postID primitive.ObjectID, page int) ([]models.Comments, error)
	AddComment(ctx context.Context, comment models.Comments) (models.Comments, error)
	DeleteComment(ctx context.Context, commentID, userID primitive.ObjectID) error
	EditComment(ctx context.Context, commentID, userID primitive.ObjectID, content string) (models.Comments, error)
}

type commentUsecase struct {
	repo repository.CommentRepository
}

func NewCommentUsecase(repo repository.CommentRepository) CommentUsecase {
	return &commentUsecase{repo: repo}
}

func (u *commentUsecase) GetComments(ctx context.Context, postID primitive.ObjectID, page int) ([]models.Comments, error) {
	return u.repo.GetComments(ctx, postID, page)
}

func (u *commentUsecase) AddComment(ctx context.Context, comment models.Comments) (models.Comments, error) {
	return u.repo.AddComment(ctx, comment)
}

func (u *commentUsecase) DeleteComment(ctx context.Context, commentID, userID primitive.ObjectID) error {
	hasReplies, err := u.repo.HasReplies(ctx, commentID)
	if err != nil {
		return err
	}
	if hasReplies {
		return errors.New("cannot delete comment with replies")
	}
	return u.repo.DeleteComment(ctx, commentID, userID)
}

func (u *commentUsecase) EditComment(ctx context.Context, commentID, userID primitive.ObjectID, content string) (models.Comments, error) {
	return u.repo.EditComment(ctx, commentID, userID, content)
}
