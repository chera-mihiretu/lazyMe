package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type ActionTaken struct {
	PostID primitive.ObjectID `json:"post_id"`
	UserID primitive.ObjectID `json:"user_id"`
	Action string             `json:"action"`
	Taken  bool               `json:"taken"`
}
