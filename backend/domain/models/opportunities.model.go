package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Opportunities defines the database model for opportunities table
type Opportunities struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	DepartmentID primitive.ObjectID `bson:"department_id" json:"department_id"`
	Title        string             `bson:"title" json:"title"`
	Description  string             `bson:"description" json:"description"`
	Link         string             `bson:"link" json:"link"`
	Type         string             `bson:"type" json:"type"` // internship or job
	PostedBy     primitive.ObjectID `bson:"posted_by" json:"posted_by"`
	CreatedAt    primitive.DateTime `bson:"created_at" json:"created_at"`
}
