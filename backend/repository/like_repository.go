package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type LikeRepository interface {
	CheckListOfLikes(ctx context.Context, pairs [][]primitive.ObjectID) ([]models.Like, error)
	CheckLike(ctx context.Context, postID, userID primitive.ObjectID) (bool, error)
	AddLike(ctx context.Context, postID, userID primitive.ObjectID) error
	RemoveLike(ctx context.Context, postID, userID primitive.ObjectID) error
}

type likeRepository struct {
	likes *mongo.Collection
	posts *mongo.Collection
}

func NewLikeRepository(db *mongo.Database) LikeRepository {
	return &likeRepository{
		likes: db.Collection("likes"),
		posts: db.Collection("posts"),
	}
}

func (r *likeRepository) CheckLike(ctx context.Context, postID, userID primitive.ObjectID) (bool, error) {
	filter := bson.M{"post_id": postID, "user_id": userID}
	count, err := r.likes.CountDocuments(ctx, filter)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *likeRepository) AddLike(ctx context.Context, postID, userID primitive.ObjectID) error {
	like := models.Like{
		ID:        primitive.NewObjectID(),
		UserID:    userID,
		PostID:    postID,
		CreatedAt: time.Now(),
	}
	exists, err := r.CheckLike(ctx, postID, userID)
	if err != nil {
		return err
	}
	if exists {
		return nil // User already liked the post, no need to insert again
	}

	_, err = r.likes.InsertOne(ctx, like)

	if err != nil {
		return err
	}

	// Optionally, you can also update the post's like count here if needed
	r.UpdateLikeCount(ctx, postID, 1)
	return err
}

func (r *likeRepository) RemoveLike(ctx context.Context, postID, userID primitive.ObjectID) error {
	filter := bson.M{"post_id": postID, "user_id": userID}
	_, err := r.likes.DeleteOne(ctx, filter)
	r.UpdateLikeCount(ctx, postID, -1)

	return err
}

func (r *likeRepository) UpdateLikeCount(ctx context.Context, postID primitive.ObjectID, amount int) error {
	updateFilter := bson.M{"_id": postID}
	update := bson.M{"$inc": bson.M{"like_count": amount}}
	_, err := r.posts.UpdateOne(ctx, updateFilter, update)
	return err

}

func (r *likeRepository) CheckListOfLikes(ctx context.Context, pairs [][]primitive.ObjectID) ([]models.Like, error) {
	filter := bson.M{
		"$or": func() []bson.M {
			var conditions []bson.M
			for _, pair := range pairs {

				if len(pair) == 2 {
					conditions = append(conditions, bson.M{"post_id": pair[0], "user_id": pair[1]})
				}
			}
			return conditions
		}(),
	}

	fmt.Println(filter)
	cursor, err := r.likes.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var likes []models.Like
	for cursor.Next(ctx) {
		var like models.Like
		if err := cursor.Decode(&like); err != nil {
			return nil, err
		}
		likes = append(likes, like)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return likes, nil
}
