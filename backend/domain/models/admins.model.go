package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Admins defines the database model for the admins table
type Admins struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID       primitive.ObjectID `bson:"user_id" json:"user_id"`
	IsSuperAdmin bool               `bson:"is_super_admin" json:"is_super_admin"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
}
