package models

import (
	"encoding/json"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Notifications defines the database model for notifications table
type Notifications struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	Type      string             `bson:"type" json:"type"`
	Payload   json.RawMessage    `bson:"payload" json:"payload"`
	IsRead    bool               `bson:"is_read" json:"is_read"`
	CreatedAt primitive.DateTime `bson:"created_at" json:"created_at"`
}
