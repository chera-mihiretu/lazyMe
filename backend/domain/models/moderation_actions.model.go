package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ModerationActions defines the database model for the moderation_actions table
type ModerationActions struct {
	ID        primitive.ObjectID `json:"id"        bson:"_id"`
	ReportID  primitive.ObjectID `json:"report_id" bson:"report_id"`
	AdminID   primitive.ObjectID `json:"admin_id"  bson:"admin_id"`
	Action    string             `json:"action"    bson:"action"` // "remove", "suspend", "warn"
	Notes     string             `json:"notes"     bson:"notes"`
	CreatedAt time.Time          `json:"created_at" bson:"created_at"`
}
