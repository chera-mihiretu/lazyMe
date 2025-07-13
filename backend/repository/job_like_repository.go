package repository

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type JobLikeRepository interface {
	CheckListOfLikes(ctx context.Context, pairs [][]primitive.ObjectID) ([]models.Like, error)
	CheckLike(ctx context.Context, postID, userID primitive.ObjectID) (bool, error)
	AddLike(ctx context.Context, postID, userID primitive.ObjectID) error
	RemoveLike(ctx context.Context, postID, userID primitive.ObjectID) error
}

type jobLikeRepository struct {
	likes    *mongo.Collection
	posts    *mongo.Collection
	likeRepo LikeRepository
}

func NewJobLikeRepository(db *mongo.Database) JobLikeRepository {
	return &jobLikeRepository{
		likes:    db.Collection("job_likes"),
		posts:    db.Collection("jobs"),
		likeRepo: NewLikeRepository(*db.Collection("job_likes"), *db.Collection("jobs")),
	}
}

func (r *jobLikeRepository) CheckLike(ctx context.Context, postID, userID primitive.ObjectID) (bool, error) {
	return r.likeRepo.CheckLike(ctx, postID, userID)
}

func (r *jobLikeRepository) AddLike(ctx context.Context, postID, userID primitive.ObjectID) error {
	return r.likeRepo.AddLike(ctx, postID, userID)
}

func (r *jobLikeRepository) RemoveLike(ctx context.Context, postID, userID primitive.ObjectID) error {
	return r.likeRepo.RemoveLike(ctx, postID, userID)
}

func (r *jobLikeRepository) CheckListOfLikes(ctx context.Context, pairs [][]primitive.ObjectID) ([]models.Like, error) {
	return r.likeRepo.CheckListOfLikes(ctx, pairs)
}
