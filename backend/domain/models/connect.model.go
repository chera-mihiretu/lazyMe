package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Connects struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	ConnectorID primitive.ObjectID `bson:"connector_id" json:"connector_id"`
	ConnecteeID primitive.ObjectID `bson:"connectee_id" json:"connectee_id"`
	Accepted    bool               `bson:"accepted" json:"accepted"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
}
