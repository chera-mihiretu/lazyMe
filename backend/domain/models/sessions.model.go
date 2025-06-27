package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Sessions defines the database model for the sessions collection
type Sessions struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID       primitive.ObjectID `bson:"user_id" json:"user_id"`
	JWTToken     string             `bson:"jwt_token" json:"jwt_token"`
	RefreshToken string             `bson:"refresh_token" json:"refresh_token"`
	ExpiresAt    time.Time          `bson:"expires_at" json:"expires_at"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
}
