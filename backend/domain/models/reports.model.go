package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// reports.model.go defines the database model for reports table
type Reports struct {
	// TODO: Add fields based on your table structure
}

type Report struct {
	ID             primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
	ReportedBy     primitive.ObjectID  `bson:"reported_by" json:"reported_by"`
	ReportedPostID primitive.ObjectID  `bson:"reported_post_id" json:"reported_post_id"`
	Reason         string              `bson:"reason" json:"reason"`
	Reviewed       bool                `bson:"reviewed" json:"reviewed"`
	ReviewedBy     *primitive.ObjectID `bson:"reviewed_by,omitempty" json:"reviewed_by,omitempty"`
	ReviewedAt     *time.Time          `bson:"reviewed_at,omitempty" json:"reviewed_at,omitempty"`
	CreatedAt      time.Time           `bson:"created_at" json:"created_at"`
}

type ReportView struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ReportedBy   UserView           `bson:"reported_by" json:"reported_by"`
	ReportedPost PostView           `bson:"reported_post" json:"reported_post"`
	Reason       string             `bson:"reason" json:"reason"`
	Reviewed     bool               `bson:"reviewed" json:"reviewed"`
	ReviewedBy   *UserView          `bson:"reviewed_by,omitempty" json:"reviewed_by,omitempty"`
	ReviewedAt   *time.Time         `bson:"reviewed_at,omitempty" json:"reviewed_at,omitempty"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
}
