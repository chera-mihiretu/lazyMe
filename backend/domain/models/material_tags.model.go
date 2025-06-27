package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// MaterialTags defines the database model for material_tags collection
type MaterialTags struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	MaterialID primitive.ObjectID `bson:"material_id" json:"material_id"`
	Tag        string             `bson:"tag" json:"tag"`
	CreatedAt  time.Time          `bson:"created_at" json:"created_at"`
}
