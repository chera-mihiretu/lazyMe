package repository

import (
	"context"
	"errors"
	"time"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type CommentRepository interface {
	GetComments(ctx context.Context, postID primitive.ObjectID, page int) ([]models.Comments, error)
	AddComment(ctx context.Context, comment models.Comments) (models.Comments, error)
	DeleteComment(ctx context.Context, commentID, userID primitive.ObjectID) error
	EditComment(ctx context.Context, commentID, userID primitive.ObjectID, content string) (models.Comments, error)
	HasReplies(ctx context.Context, commentID primitive.ObjectID) (bool, error)
}

type commentRepository struct {
	comments *mongo.Collection
}

func NewCommentRepository(db *mongo.Database) CommentRepository {
	return &commentRepository{
		comments: db.Collection("comments"),
	}
}

func (r *commentRepository) GetComments(ctx context.Context, postID primitive.ObjectID, page int) ([]models.Comments, error) {
	filter := bson.M{"post_id": postID, "parent_comment_id": bson.M{"$exists": false}}

	pageSize := Pagesize

	findOption := options.Find().SetSkip(int64((page - 1) * pageSize)).SetLimit(Pagesize)
	cursor, err := r.comments.Find(ctx, filter, findOption)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	var comments []models.Comments
	for cursor.Next(ctx) {
		var comment models.Comments
		if err := cursor.Decode(&comment); err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return comments, nil
}

func (r *commentRepository) AddComment(ctx context.Context, comment models.Comments) (models.Comments, error) {

	comment.CreatedAt = time.Now()
	_, err := r.comments.InsertOne(ctx, comment)
	if err != nil {
		return models.Comments{}, err
	}
	return comment, nil
}

func (r *commentRepository) DeleteComment(ctx context.Context, commentID, userID primitive.ObjectID) error {
	if yes, err := r.HasReplies(ctx, commentID); !yes || err != nil {
		return errors.New("cannot delete comment with replies")
	}

	filter := bson.M{"_id": commentID, "user_id": userID}
	res, err := r.comments.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}
	if res.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}
	return nil
}

func (r *commentRepository) EditComment(ctx context.Context, commentID, userID primitive.ObjectID, content string) (models.Comments, error) {
	filter := bson.M{"_id": commentID, "user_id": userID}
	update := bson.M{"$set": bson.M{"content": content}}
	res := r.comments.FindOneAndUpdate(ctx, filter, update)
	var updated models.Comments
	err := res.Decode(&updated)
	if err != nil {
		return models.Comments{}, err
	}
	return updated, nil
}

func (r *commentRepository) HasReplies(ctx context.Context, commentID primitive.ObjectID) (bool, error) {
	filter := bson.M{"parent_comment_id": commentID}
	count, err := r.comments.CountDocuments(ctx, filter)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}
