package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// PostLikes defines the database model for post_likes table
type PostLikes struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	PostID    primitive.ObjectID `bson:"post_id" json:"post_id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}
