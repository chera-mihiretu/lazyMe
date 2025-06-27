package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ChannelUsers defines the database model for channel_users table
type ChannelUsers struct {
	ID        primitive.ObjectID `json:"id" bson:"_id"`
	ChannelID primitive.ObjectID `json:"channel_id" bson:"channel_id"`
	UserID    primitive.ObjectID `json:"user_id" bson:"user_id"`
	Role      string             `json:"role" bson:"role"`
	JoinedAt  time.Time          `json:"joined_at" bson:"joined_at"`
}
