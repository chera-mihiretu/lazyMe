package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Email_verifications defines the database model for email_verifications table
type EmailVerification struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	UserEmail string             `bson:"user_email" json:"user_email"`
	Token     string             `bson:"token" json:"token"`
	SentAt    time.Time          `bson:"sent_at" json:"sent_at"`
	ExpiresAt time.Time          `bson:"expires_at" json:"expires_at"`
}
