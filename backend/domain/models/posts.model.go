package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Posts defines the database model for the posts collection
type Posts struct {
	ID             primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	UserID         primitive.ObjectID   `bson:"user_id" json:"user_id"`
	Content        string               `bson:"content" json:"content"`
	IsAnnouncement bool                 `bson:"is_announcement" json:"is_announcement"`
	IsValidated    bool                 `bson:"is_validated" json:"is_validated"`
	IsFlagged      bool                 `bson:"is_flagged" json:"is_flagged"`
	Likes          int                  `bson:"likes" json:"likes"`
	Comments       int                  `bson:"comments" json:"comments"`
	Departements   []primitive.ObjectID `bson:"department_id" json:"department_id"`
	CreatedAt      time.Time            `bson:"created_at" json:"created_at"`
	UpdatedAt      time.Time            `bson:"updated_at" json:"updated_at"`
}
