package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Channels defines the database model for the channels table
type Channels struct {
	ID        primitive.ObjectID `json:"id" bson:"_id"`
	Name      string             `json:"name" bson:"name"`
	CreatedBy primitive.ObjectID `json:"created_by" bson:"created_by"`
	CreatedAt time.Time          `json:"created_at" bson:"created_at"`
}
