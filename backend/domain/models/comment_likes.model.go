package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CommentLikes defines the database model for the comment_likes table
type CommentLikes struct {
	ID        primitive.ObjectID `json:"id" bson:"_id"`
	CommentID primitive.ObjectID `json:"comment_id" bson:"comment_id"`
	UserID    primitive.ObjectID `json:"user_id" bson:"user_id"`
	CreatedAt time.Time          `json:"created_at" bson:"created_at"`
}
