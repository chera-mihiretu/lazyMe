package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Email_verifications defines the database model for email_verifications table
type Email_verifications struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	Token     string             `bson:"token" json:"token"`
	SentAt    time.Time          `bson:"sent_at" json:"sent_at"`
	ExpiresAt time.Time          `bson:"expires_at" json:"expires_at"`
	Consumed  bool               `bson:"consumed" json:"consumed"`
}
