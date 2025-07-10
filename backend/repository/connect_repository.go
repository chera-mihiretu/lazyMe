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
	GetConnectionSuggestions(ctx context.Context, userID string, page int) ([]string, error)
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
func (c *connectRepository) GetConnectionSuggestions(ctx context.Context, userID string, page int) ([]string, error) {
	// Step 1: Get the user's followers (users who follow userID)
	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	// Followers: users where connectee_id == userID and accepted == true
	followerFilter := bson.M{
		"$or": []bson.M{
			{"connectee_id": userObjID},
			{"connector_id": userObjID},
		},
	}
	followerCursor, err := c.connects.Find(ctx, followerFilter)
	if err != nil {
		return nil, err
	}
	defer followerCursor.Close(ctx)

	followerIDs := []primitive.ObjectID{}
	for followerCursor.Next(ctx) {
		var conn models.Connects
		if err := followerCursor.Decode(&conn); err != nil {
			return nil, err
		}
		if conn.ConnectorID == userObjID {
			followerIDs = append(followerIDs, conn.ConnecteeID)
		} else {
			followerIDs = append(followerIDs, conn.ConnectorID)
		}
	}

	// Step 2: Get users connected with the followers collected
	secondDegreeFilter := bson.M{
		"$or": []bson.M{
			{"connector_id": bson.M{"$in": followerIDs}, "accepted": true},
			{"connectee_id": bson.M{"$in": followerIDs}, "accepted": true},
		},
		"$nor": []bson.M{
			{"connector_id": userObjID},
			{"connectee_id": userObjID},
		},
	}

	halfPageSize := ConnectPageSize / 2
	skip := (page - 1) * halfPageSize
	limit := halfPageSize

	findOptions := options.Find().SetSkip(int64(skip)).SetLimit(int64(limit))
	secondDegreeCursor, err := c.connects.Find(ctx, secondDegreeFilter, findOptions)
	if err != nil {
		return nil, err
	}
	defer secondDegreeCursor.Close(ctx)

	suggestionSet := make(map[primitive.ObjectID]struct{})
	for secondDegreeCursor.Next(ctx) {
		var conn models.Connects
		if err := secondDegreeCursor.Decode(&conn); err != nil {
			return nil, err
		}
		// Exclude self and already-followed users
		if conn.ConnecteeID != userObjID {
			suggestionSet[conn.ConnecteeID] = struct{}{}
		}
	}

	// Remove the original user from suggestions if present
	delete(suggestionSet, userObjID)

	// Convert ObjectIDs to hex string for return
	suggestions := make([]string, 0, len(suggestionSet))
	for id := range suggestionSet {
		suggestions = append(suggestions, id.Hex())
	}

	// Step 3: Collect users ordered by the count of followers, excluding followerIDs
	pipeline := mongo.Pipeline{
		// Match users not in followerIDs
		{{Key: "$match", Value: bson.M{"_id": bson.M{"$nin": followerIDs}}}},
		// Lookup followers count
		{{Key: "$lookup", Value: bson.M{
			"from":         "connects",
			"localField":   "_id",
			"foreignField": "connectee_id",
			"as":           "followers",
		}}},
		// Project followers count
		{{Key: "$project", Value: bson.M{
			"_id":            1,
			"followersCount": bson.M{"$size": "$followers"},
		}}},
		// Sort by followers count descending
		{{Key: "$sort", Value: bson.M{"followersCount": -1}}},
		// Pagination
		{{Key: "$skip", Value: int64(skip)}},
		{{Key: "$limit", Value: int64(limit)}},
	}

	cursor, err := c.usersCollection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var user struct {
			ID string `bson:"_id"`
		}
		if err := cursor.Decode(&user); err != nil {
			return nil, err
		}
		suggestions = append(suggestions, user.ID)
	}

	return suggestions, nil
}

// GetConnectRequests returns a paginated list of connect requests for a user.
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

	// Update the connector's follow count
	connectorUpdateResult, err := c.usersCollection.UpdateOne(ctx, bson.M{"_id": connect.ConnectorID},
		bson.M{"$inc": bson.M{"follow_count": -1}})
	if err != nil {
		return fmt.Errorf("failed to update connector's follow count: %v", err)
	}
	if connectorUpdateResult.MatchedCount == 0 {
		return mongo.ErrNoDocuments // No document found to update
	}

	// Update the connectee's follow count
	connecteeUpdateResult, err := c.usersCollection.UpdateOne(ctx, bson.M{"_id": connect.ConnecteeID},
		bson.M{"$inc": bson.M{"follow_count": -1}})
	if err != nil {
		return fmt.Errorf("failed to update connectee's follow count: %v", err)
	}
	if connecteeUpdateResult.MatchedCount == 0 {
		return mongo.ErrNoDocuments // No document found to update
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

	// Increment the connector's follow count
	connectorUpdateResult, err := c.usersCollection.UpdateOne(ctx, bson.M{"_id": connect.ConnectorID},
		bson.M{"$inc": bson.M{"follow_count": 1}})
	if err != nil {
		return fmt.Errorf("failed to update connector's follow count: %v", err)
	}
	if connectorUpdateResult.MatchedCount == 0 {
		return mongo.ErrNoDocuments // No document found to update
	}

	// Increment the connectee's follow count
	connecteeUpdateResult, err := c.usersCollection.UpdateOne(ctx, bson.M{"_id": connect.ConnecteeID},
		bson.M{"$inc": bson.M{"follow_count": 1}})
	if err != nil {
		return fmt.Errorf("failed to update connectee's follow count: %v", err)
	}
	if connecteeUpdateResult.MatchedCount == 0 {
		return mongo.ErrNoDocuments // No document found to update
	}

	return nil
}
