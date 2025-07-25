package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Materials defines the database model for the materials table
type Materials struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id" form:"id"`
	Title        string             `bson:"title" json:"title" form:"title"`
	DepartmentID primitive.ObjectID `bson:"department_id" json:"department_id" form:"department_id"`
	Year         int                `bson:"year" json:"year" form:"year"`
	Semester     int                `bson:"semester" json:"semester" form:"semester"`
	FileURL      string             `bson:"file" json:"file" form:"file_url"`
	UploadedBy   primitive.ObjectID `bson:"uploaded_by" json:"uploaded_by" form:"uploaded_by"`
	IsVerified   bool               `bson:"is_verified" json:"is_verified" form:"is_verified"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at" form:"created_at"`
	UpdatedAt    time.Time          `bson:"updated_at" json:"updated_at" form:"updated_at"`
}

type MaterialsForm struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id" form:"id"`
	Title        string             `bson:"title" json:"title" form:"title"`
	DepartmentID string             `bson:"department_id" json:"department_id" form:"department_id"`
	Year         int                `bson:"year" json:"year" form:"year"`
	Semester     int                `bson:"semester" json:"semester" form:"semester"`
	FileURL      string             `bson:"file" json:"file" form:"file"`
	UploadedBy   primitive.ObjectID `bson:"uploaded_by" json:"uploaded_by" form:"uploaded_by"`
	IsVerified   bool               `bson:"is_verified" json:"is_verified" form:"is_verified"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at" form:"created_at"`
	UpdatedAt    time.Time          `bson:"updated_at" json:"updated_at" form:"updated_at"`
}
