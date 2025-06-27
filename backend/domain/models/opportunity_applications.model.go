package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// OpportunityApplications defines the database model for opportunity_applications table
type OpportunityApplications struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	OpportunityID primitive.ObjectID `bson:"opportunity_id" json:"opportunity_id"`
	ApplicantID   primitive.ObjectID `bson:"applicant_id" json:"applicant_id"`
	ResumeLink    string             `bson:"resume_link" json:"resume_link"`
	AppliedAt     time.Time          `bson:"applied_at" json:"applied_at"`
}
