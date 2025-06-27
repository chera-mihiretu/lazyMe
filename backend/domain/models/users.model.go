package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Users defines the database model for users table
type Users struct {
	ID              primitive.ObjectID `gorm:"type:uuid;primaryKey" json:"id" bson:"id"`
	Name            string             `gorm:"type:varchar" json:"name" bson:"name"`
	Email           string             `gorm:"type:varchar;unique;not null" json:"email" bson:"email"`
	PasswordHash    string             `gorm:"type:varchar" json:"password_hash" bson:"password_hash"`
	Role            string             `gorm:"type:varchar" json:"role" bson:"role"`
	ProfileImageURL string             `gorm:"type:varchar" json:"profile_image_url" bson:"profile_image_url"`
	IsVerified      bool               `json:"is_verified" bson:"is_verified"`
	IsTeacher       bool               `json:"is_teacher" bson:"is_teacher"`
	BlueBadge       bool               `json:"blue_badge" bson:"blue_badge"`
	CreatedAt       time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt       time.Time          `json:"updated_at" bson:"updated_at"`
}
