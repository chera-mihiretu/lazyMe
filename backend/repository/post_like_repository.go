package repository

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type PostLikeRepository interface {
	CheckListOfLikes(ctx context.Context, pairs [][]primitive.ObjectID) ([]models.Like, error)
	CheckLike(ctx context.Context, postID, userID primitive.ObjectID) (bool, error)
	AddLike(ctx context.Context, postID, userID primitive.ObjectID) error
	RemoveLike(ctx context.Context, postID, userID primitive.ObjectID) error
}

type postLikeRepository struct {
	likes    *mongo.Collection
	posts    *mongo.Collection
	likeRepo LikeRepository
}

func NewPostLikeRepository(db *mongo.Database) PostLikeRepository {
	return &postLikeRepository{
		likes:    db.Collection("post_likes"),
		posts:    db.Collection("posts"),
		likeRepo: NewLikeRepository(*db.Collection("post_likes"), *db.Collection("posts")),
	}
}

func (r *postLikeRepository) CheckLike(ctx context.Context, postID, userID primitive.ObjectID) (bool, error) {
	return r.likeRepo.CheckLike(ctx, postID, userID)
}

func (r *postLikeRepository) AddLike(ctx context.Context, postID, userID primitive.ObjectID) error {
	return r.likeRepo.AddLike(ctx, postID, userID)
}

func (r *postLikeRepository) RemoveLike(ctx context.Context, postID, userID primitive.ObjectID) error {
	return r.likeRepo.RemoveLike(ctx, postID, userID)
}

func (r *postLikeRepository) CheckListOfLikes(ctx context.Context, pairs [][]primitive.ObjectID) ([]models.Like, error) {
	return r.likeRepo.CheckListOfLikes(ctx, pairs)
}
