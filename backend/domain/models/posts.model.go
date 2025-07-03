package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Posts defines the database model for the posts collection
type Posts struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id" form:"id"`
	UserID          primitive.ObjectID `bson:"user_id" json:"user_id" form:"user_id"`
	Content         string             `bson:"content" json:"content" form:"content"`
	PostAttachments []string           `bson:"post_attachments" json:"post_attachments" form:"post_attachments"`
	IsAnnouncement  bool               `bson:"is_announcement" json:"is_announcement" form:"is_announcement"`
	IsValidated     bool               `bson:"is_validated" json:"is_validated" form:"is_validated"`
	IsFlagged       bool               `bson:"is_flagged" json:"is_flagged" form:"is_flagged"`
	Likes           int                `bson:"likes" json:"likes" form:"likes"`
	Comments        int                `bson:"comments" json:"comments" form:"comments"`
	Departements    []string           `bson:"department_id" json:"department_id" form:"department_id" `
	Tags            []string           `bson:"tags" json:"tags" form:"tags"`
	CreatedAt       time.Time          `bson:"created_at" json:"created_at" form:"created_at"`
	UpdatedAt       time.Time          `bson:"updated_at" json:"updated_at" form:"updated_at"`
}

type PostView struct {
	ID              primitive.ObjectID `bson:"_id" json:"id"`
	UserID          UserView           `bson:"user_id" json:"user_id"`
	Content         string             `bson:"content" json:"content"`
	PostAttachments []string           `bson:"post_attachments" json:"post_attachments"`
	IsAnnouncement  bool               `bson:"is_announcement" json:"is_announcement"`
	IsValidated     bool               `bson:"is_validated" json:"is_validated"`
	IsFlagged       bool               `bson:"is_flagged" json:"is_flagged"`
	Likes           int                `bson:"likes" json:"likes"`
	Comments        int                `bson:"comments" json:"comments"`
	CreatedAt       time.Time          `bson:"created_at" json:"created_at"`
}
