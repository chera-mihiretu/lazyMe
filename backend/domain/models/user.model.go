package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Users defines the database model for users table
type User struct {
	ID              primitive.ObjectID  `json:"id" bson:"_id"`
	Name            string              `json:"name" bson:"name"`
	Email           string              `json:"email" bson:"email"`
	GoogleID        string              `json:"google_id" bson:"google_id"`
	PasswordHash    string              `json:"password" bson:"password_hash"`
	Role            string              `json:"role" bson:"role"`
	School          string              `json:"school" bson:"school"`
	FollowCount     int                 `json:"follow_count" bson:"follow_count"`
	Department      *primitive.ObjectID `json:"department,omitempty" bson:"department,omitempty"`
	AcedemicYear    int                 `json:"acedemic_year" bson:"acedemic_year"`
	ProfileImageURL string              `json:"profile_image_url" bson:"profile_image_url"`
	IsVerified      bool                `json:"is_verified" bson:"is_verified"`
	IsTeacher       bool                `json:"is_teacher" bson:"is_teacher"`
	BlueBadge       bool                `json:"blue_badge" bson:"blue_badge"`
	CreatedAt       time.Time           `json:"created_at" bson:"created_at"`
	UpdatedAt       time.Time           `json:"updated_at" bson:"updated_at"`
}

type UserView struct {
	ID              primitive.ObjectID `json:"id" bson:"_id"`
	Name            string             `json:"name" bson:"name"`
	Email           string             `json:"email" bson:"email"`
	GoogleID        string             `json:"google_id" bson:"google_id"`
	School          string             `json:"school" bson:"school"`
	FollowCount     int                `json:"follow_count" bson:"follow_count"`
	Department      string             `json:"department" bson:"department"`
	AcedemicYear    int                `json:"acedemic_year" bson:"acedemic_year"`
	ProfileImageURL string             `json:"profile_image_url" bson:"profile_image_url"`
	IsTeacher       bool               `json:"is_teacher" bson:"is_teacher"`
	BlueBadge       bool               `json:"blue_badge" bson:"blue_badge"`
	CreatedAt       time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt       time.Time          `json:"updated_at" bson:"updated_at"`
}
