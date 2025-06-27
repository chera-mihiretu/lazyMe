package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Comments defines the database model for the comments table
type Comments struct {
	ID              primitive.ObjectID  `json:"id" bson:"_id"`
	PostID          primitive.ObjectID  `json:"post_id" bson:"post_id"`
	UserID          primitive.ObjectID  `json:"user_id" bson:"user_id"`
	ParentCommentID *primitive.ObjectID `json:"parent_comment_id,omitempty" bson:"parent_comment_id,omitempty"`
	Content         string              `json:"content" bson:"content"`
	CreatedAt       time.Time           `json:"created_at" bson:"created_at"`
}
