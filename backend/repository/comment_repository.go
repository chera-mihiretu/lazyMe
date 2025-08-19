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
	GetCommentByID(ctx context.Context, commentID primitive.ObjectID) (models.Comments, error)
	GetReply(ctx context.Context, commentID primitive.ObjectID, page int) ([]models.Comments, error)
	AddComment(ctx context.Context, comment models.Comments) (models.Comments, error)
	DeleteComment(ctx context.Context, commentID, userID primitive.ObjectID) error
	EditComment(ctx context.Context, commentID, userID primitive.ObjectID, content string) (models.Comments, error)
	AddReply(ctx context.Context, reply models.Comments) (models.Comments, error)
}

type commentRepository struct {
	comments *mongo.Collection
	posts    *mongo.Collection
}

func NewCommentRepository(db *mongo.Database) CommentRepository {
	return &commentRepository{
		comments: db.Collection("comments"),
		posts:    db.Collection("posts"),
	}
}

func (r *commentRepository) GetCommentByID(ctx context.Context, commentID primitive.ObjectID) (models.Comments, error) {
	filter := bson.M{"_id": commentID}
	var comment models.Comments
	err := r.comments.FindOne(ctx, filter).Decode(&comment)
	if err != nil {
		return models.Comments{}, err
	}
	return comment, nil
}

func (r *commentRepository) GetComments(ctx context.Context, postID primitive.ObjectID, page int) ([]models.Comments, error) {
	filter := bson.M{"post_id": postID, "parent_comment_id": bson.M{"$exists": false}}

	pageSize := Pagesize

	findOption := options.Find().SetSkip(int64((page - 1) * pageSize)).SetLimit(Pagesize + 1)
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
	id := primitive.NewObjectID()
	comment.ID = id
	comment.CreatedAt = time.Now()
	_, err := r.comments.InsertOne(ctx, comment)
	if err != nil {
		return models.Comments{}, err
	}
	_, err = r.posts.UpdateOne(ctx, bson.M{"_id": comment.PostID}, bson.M{"$inc": bson.M{"comments": 1}})
	if err != nil {
		return models.Comments{}, err
	}
	return comment, nil
}

func (r *commentRepository) DeleteComment(ctx context.Context, commentID, userID primitive.ObjectID) error {
	var comment models.Comments

	filter := bson.M{"_id": commentID, "user_id": userID}
	err := r.comments.FindOne(ctx, filter).Decode(&comment)
	if comment.ReplyCount > 0 {
		return errors.New("cannot delete comment with replies")
	}
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return errors.New("comment not found or you do not have permission to delete it")
		}
	}
	res, err := r.comments.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}
	if res.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}
	_, err = r.posts.UpdateOne(ctx, bson.M{"_id": comment.PostID}, bson.M{"$inc": bson.M{"comments": -1}})

	if err != nil {
		return err
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

func (r *commentRepository) GetReply(ctx context.Context, commentID primitive.ObjectID, page int) ([]models.Comments, error) {
	pageSize := Pagesize
	filter := bson.M{"parent_comment_id": commentID}

	findOption := options.Find().SetSkip(int64((page - 1) * pageSize)).SetLimit(Pagesize + 1)
	cursor, err := r.comments.Find(ctx, filter, findOption)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var replies []models.Comments
	for cursor.Next(ctx) {
		var reply models.Comments
		if err := cursor.Decode(&reply); err != nil {
			return nil, err
		}
		replies = append(replies, reply)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return replies, nil
}

func (r *commentRepository) AddReply(ctx context.Context, reply models.Comments) (models.Comments, error) {
	reply.CreatedAt = time.Now()
	reply.ReplyCount = 0 // Replies do not have replies
	reply.ID = primitive.NewObjectID()

	var comment models.Comments
	filter := bson.M{"_id": reply.ParentCommentID}
	err := r.comments.FindOne(ctx, filter).Decode(&comment)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return models.Comments{}, errors.New("parent comment not found")
		}
		return models.Comments{}, err
	}

	_, err = r.comments.InsertOne(ctx, reply)
	if err != nil {
		return models.Comments{}, err
	}

	// Update the parent comment to indicate it has replies
	_, err = r.comments.UpdateOne(ctx, bson.M{"_id": reply.ParentCommentID}, bson.M{"$inc": bson.M{"reply_count": 1}})
	if err != nil {
		return models.Comments{}, err
	}
	return reply, nil
}
