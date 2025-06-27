package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// AuditLogs defines the database model for audit_logs table
type AuditLogs struct {
	ID         primitive.ObjectID     `json:"id" bson:"_id"`
	UserID     primitive.ObjectID     `json:"user_id" bson:"user_id"`
	Action     string                 `json:"action" bson:"action"`
	TargetType string                 `json:"target_type" bson:"target_type"`
	TargetID   primitive.ObjectID     `json:"target_id" bson:"target_id"`
	Details    map[string]interface{} `json:"details" bson:"details"`
	CreatedAt  time.Time              `json:"created_at" bson:"created_at"`
}
