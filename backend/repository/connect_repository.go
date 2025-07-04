package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	ConnectPageSize = 10
)

// ConnectRepository replaces follow relationships with connects.
type ConnectRepository interface {
	GetConnects(ctx context.Context, userID string) ([]models.Connects, error)
	GetConnections(ctx context.Context, userID string, page int) ([]models.Connects, error)
	GetConnectRequests(ctx context.Context, userID string, page int) ([]models.Connects, error)
	CreateConnection(ctx context.Context, connect models.Connects) error
	DeleteConnection(ctx context.Context, connect models.Connects) error
	IsConnected(ctx context.Context, connect models.Connects) (bool, error)
	GetConnectionsCount(ctx context.Context, userID string) (int64, error)
	AcceptConnection(ctx context.Context, connect models.Connects) error
}

type connectRepository struct {
	connects        *mongo.Collection
	usersCollection *mongo.Collection
}

// NewConnectRepository creates a new repository instance for connects.
func NewConnectRepository(db *mongo.Database) ConnectRepository {
	return &connectRepository{
		connects:        db.Collection("connects"),
		usersCollection: db.Collection("users"),
	}
}

func (c *connectRepository) GetConnectRequests(ctx context.Context, userID string, page int) ([]models.Connects, error) {
	var connects []models.Connects
	key, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	// Create a simple filter for connect requests that targets the specified user
	filter := bson.M{
		"connectee_id": key,
		"accepted":     false,
	}

	skip := (page - 1) * ConnectPageSize
	limit := ConnectPageSize

	findOptions := options.Find().SetSkip(int64(skip)).SetLimit(int64(limit))

	cursor, err := c.connects.Find(ctx, filter, findOptions)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var connect models.Connects
		if err := cursor.Decode(&connect); err != nil {
			return nil, err
		}
		connects = append(connects, connect)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return connects, nil
}

func (c *connectRepository) GetConnects(ctx context.Context, userID string) ([]models.Connects, error) {
	var connects []models.Connects
	userIDPri, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}
	filter := bson.M{
		"$and": []bson.M{
			{
				"$or": []bson.M{
					{"connectee_id": userIDPri},
					{"connector_id": userIDPri},
				},
			},
			{"accepted": true},
		},
	}

	cursor, err := c.connects.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var connect models.Connects
		if err := cursor.Decode(&connect); err != nil {
			return nil, err
		}
		connects = append(connects, connect)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return connects, nil

}

// GetConnects returns a paginated list of connect relationships for a user.
func (c *connectRepository) GetConnections(ctx context.Context, userID string, page int) ([]models.Connects, error) {
	var connects []models.Connects
	userIDprimitive, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, errors.New("invalid user ID format")
	}
	filter := bson.M{
		"$and": []bson.M{
			{
				"$or": []bson.M{
					{"connectee_id": userIDprimitive},
					{"connector_id": userIDprimitive},
				},
			},
			{"accepted": true},
		},
	}
	skip := (page - 1) * ConnectPageSize
	limit := ConnectPageSize

	findOptions := options.Find().SetSkip(int64(skip)).SetLimit(int64(limit))
	cursor, err := c.connects.Find(ctx, filter, findOptions)

	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var connect models.Connects
		if err := cursor.Decode(&connect); err != nil {
			return nil, err
		}
		connects = append(connects, connect)
	}

	fmt.Println("Connects found:", len(connects))

	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return connects, nil
}

// CreateConnect implements the logic to create a connect relationship.
func (c *connectRepository) CreateConnection(ctx context.Context, connect models.Connects) error {
	// Check if the connect already exists
	filter := bson.M{
		"$or": []bson.M{
			{"connector_id": connect.ConnectorID, "connectee_id": connect.ConnecteeID},
			{"connector_id": connect.ConnecteeID, "connectee_id": connect.ConnectorID},
		},
	}

	existingConnect, err := c.connects.CountDocuments(ctx, filter)

	if err != nil {
		return err
	}
	if existingConnect > 0 {
		return errors.New("connection already sent") // Connect already exists, no need to create
	}

	// Insert the new connect relationship
	connect.CreatedAt = time.Now()
	connect.Accepted = false
	_, err = c.connects.InsertOne(ctx, connect)
	if err != nil {
		return err
	}
	return nil
}

// DeleteConnect implements the logic to delete a connect relationship.
func (c *connectRepository) DeleteConnection(ctx context.Context, connect models.Connects) error {
	// Create a filter to find the connect relationship
	filter := bson.M{
		"$or": []bson.M{
			{"connector_id": connect.ConnectorID, "connectee_id": connect.ConnecteeID},
			{"connector_id": connect.ConnecteeID, "connectee_id": connect.ConnectorID},
		},
	}

	// Delete the connect relationship
	result, err := c.connects.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}
	if result.DeletedCount == 0 {
		return mongo.ErrNoDocuments // No document found to delete
	}
	return nil
}

// IsConnected checks if the user is connected to another user.
func (c *connectRepository) IsConnected(ctx context.Context, connect models.Connects) (bool, error) {
	filter := bson.M{
		"$or": []bson.M{
			{"connector_id": connect.ConnectorID, "connectee_id": connect.ConnecteeID},
			{"connector_id": connect.ConnecteeID, "connectee_id": connect.ConnectorID},
		},
		"accepted": true,
	}

	count, err := c.connects.CountDocuments(ctx, filter)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// GetConnectionsCount returns the count of connections for a user.
func (c *connectRepository) GetConnectionsCount(ctx context.Context, userID string) (int64, error) {
	id, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return 0, errors.New("invalid user ID format")
	}
	filter := bson.M{
		"_id": id,
	}
	var user models.User
	err = c.usersCollection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		return 0, err

	}

	return int64(user.FollowCount), nil

}

func (c *connectRepository) AcceptConnection(ctx context.Context, connect models.Connects) error {
	// Create a filter to find the connect relationship
	filter := bson.M{
		"connector_id": connect.ConnectorID,
		"connectee_id": connect.ConnecteeID,
		"accepted":     false,
	}

	update := bson.M{
		"$set": bson.M{
			"accepted":   true,
			"updated_at": time.Now(),
		},
	}

	result, err := c.connects.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}
	if result.MatchedCount == 0 {
		return mongo.ErrNoDocuments // No document found to update
	}
	return nil
}
