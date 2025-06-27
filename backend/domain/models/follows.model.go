package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Follows struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	FollowerID primitive.ObjectID `bson:"follower_id" json:"follower_id"`
	FollowedID primitive.ObjectID `bson:"followed_id" json:"followed_id"`
	CreatedAt  time.Time          `bson:"created_at" json:"created_at"`
}
