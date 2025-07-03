package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Departments defines the database model for the departments table
type Departments struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name        string             `bson:"name" json:"name"`
	Description string             `bson:"description" json:"description"`
	CreatedAt   primitive.DateTime `bson:"created_at" json:"created_at"`
}
