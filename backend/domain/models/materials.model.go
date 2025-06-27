package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Materials defines the database model for the materials table
type Materials struct {
	ID               primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
	Title            string              `bson:"title" json:"title"`
	DepartmentID     primitive.ObjectID  `bson:"department_id" json:"department_id"`
	CourseID         primitive.ObjectID  `bson:"course_id" json:"course_id"`
	Year             int                 `bson:"year" json:"year"`
	FileURL          string              `bson:"file_url" json:"file_url"`
	UploadedBy       primitive.ObjectID  `bson:"uploaded_by" json:"uploaded_by"`
	ParentMaterialID *primitive.ObjectID `bson:"parent_material_id,omitempty" json:"parent_material_id,omitempty"`
	IsVerified       bool                `bson:"is_verified" json:"is_verified"`
	CreatedAt        time.Time           `bson:"created_at" json:"created_at"`
}
