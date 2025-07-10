package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type University struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name      string             `bson:"name" json:"name"`
	City      string             `bson:"city" json:"country"`
	CreatedBy primitive.ObjectID `bson:"created_by" json:"created_by"`
	CreatedAt primitive.DateTime `bson:"created_at" json:"created_at"`
	UpdatedAt primitive.DateTime `bson:"updated_at" json:"updated_at"`
}
