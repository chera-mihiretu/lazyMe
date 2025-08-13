package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ReportAction struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ReportID    primitive.ObjectID `bson:"report_id" json:"report_id"`
	Action      string             `bson:"action" json:"action"` // e.g., "approved", "rejected"
	Description string             `bson:"description,omitempty" json:"description,omitempty"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
	PerformedBy primitive.ObjectID `bson:"performed_by" json:"performed_by"` //
}
