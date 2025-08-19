package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Notifications defines the database model for notifications table
type Notifications struct {
	ID        primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID  `bson:"user_id" json:"user_id"`
	To        primitive.ObjectID  `bson:"to" json:"to"`
	Type      string              `bson:"type" json:"type"`
	Content   string              `bson:"content" json:"content"`
	IsRead    bool                `bson:"is_read" json:"is_read"`
	ContentID *primitive.ObjectID `bson:"content_id" json:"content_id"` // for example, post id, comment id, etc.
	CreatedAt time.Time           `bson:"created_at" json:"created_at"`
}

type NotificationView struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	User      UserView           `bson:"user" json:"user"`
	To        UserView           `bson:"to" json:"to"`
	Type      string             `bson:"type" json:"type"`
	Content   string             `bson:"content" json:"content"`
	IsRead    bool               `bson:"is_read" json:"is_read"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}
