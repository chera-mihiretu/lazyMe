package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// PostAttachments defines the database model for post_attachments collection
type PostAttachments struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	PostID    primitive.ObjectID `bson:"post_id" json:"post_id"`
	FilesURL  string             `bson:"file_url" json:"file_url"`
	FileType  string             `bson:"file_type" json:"file_type"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}
