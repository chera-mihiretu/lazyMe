package repository

import (
	"context"
	"errors"
	"fmt"
	"sort"
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
	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	// Step 1: Get all users the current user is already connected to (including self)
	connectedIDs := map[primitive.ObjectID]struct{}{userObjID: {}} // start with self
	connFilter := bson.M{
		"$or": []bson.M{
			{"connectee_id": userObjID},
			{"connector_id": userObjID},
		},
		"accepted": true,
	}
	connCursor, err := c.connects.Find(ctx, connFilter)
	if err != nil {
		return nil, err
	}
	defer connCursor.Close(ctx)
	for connCursor.Next(ctx) {
		var conn models.Connects
		if err := connCursor.Decode(&conn); err != nil {
			return nil, err
		}
		connectedIDs[conn.ConnectorID] = struct{}{}
		connectedIDs[conn.ConnecteeID] = struct{}{}
	}

	// Step 2: Find second-degree connections (friends of friends), excluding already connected and self
	secondDegreeFilter := bson.M{
		"$or": []bson.M{
			{"connector_id": bson.M{"$in": keys(connectedIDs)}, "accepted": true},
			{"connectee_id": bson.M{"$in": keys(connectedIDs)}, "accepted": true},
		},
	}
	secondDegreeCursor, err := c.connects.Find(ctx, secondDegreeFilter)
	if err != nil {
		return nil, err
	}
	defer secondDegreeCursor.Close(ctx)
	mutualCount := map[primitive.ObjectID]int{}
	for secondDegreeCursor.Next(ctx) {
		var conn models.Connects
		if err := secondDegreeCursor.Decode(&conn); err != nil {
			return nil, err
		}
		// Only consider users not already connected and not self
		if _, ok := connectedIDs[conn.ConnectorID]; !ok {
			mutualCount[conn.ConnectorID]++
		}
		if _, ok := connectedIDs[conn.ConnecteeID]; !ok {
			mutualCount[conn.ConnecteeID]++
		}
	}

	// Step 3: Aggregate users not already connected, not self, order by mutualCount and follow_count
	candidateIDs := make([]primitive.ObjectID, 0, len(mutualCount))
	for id := range mutualCount {
		candidateIDs = append(candidateIDs, id)
	}
	if len(candidateIDs) == 0 {
		return []string{}, nil
	}

	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.M{"_id": bson.M{"$in": candidateIDs}}}},
		{{Key: "$addFields", Value: bson.M{"mutual": bson.M{"$literal": 0}}}}, // placeholder, will update below
		{{Key: "$sort", Value: bson.M{"follow_count": -1}}},
	}
	userCursor, err := c.usersCollection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer userCursor.Close(ctx)

	type userWithMutual struct {
		ID    primitive.ObjectID `bson:"_id"`
		Count int                `bson:"follow_count"`
	}
	users := []userWithMutual{}
	for userCursor.Next(ctx) {
		var u userWithMutual
		if err := userCursor.Decode(&u); err != nil {
			return nil, err
		}
		// Attach mutual count from map
		u.Count = mutualCount[u.ID]
		users = append(users, u)
	}

	// Sort by mutual connections (desc), then by follow_count (desc)
	sort.Slice(users, func(i, j int) bool {
		if users[i].Count == users[j].Count {
			return users[i].Count > users[j].Count
		}
		return users[i].Count > users[j].Count
	})

	// Pagination
	start := (page - 1) * ConnectPageSize
	end := start + ConnectPageSize
	if start > len(users) {
		return []string{}, nil
	}
	if end > len(users) {
		end = len(users)
	}

	suggestions := make([]string, 0, end-start)
	for _, u := range users[start:end] {
		suggestions = append(suggestions, u.ID.Hex())
	}
	return suggestions, nil
}

// helper to get keys from map[primitive.ObjectID]struct{}
func keys(m map[primitive.ObjectID]struct{}) []primitive.ObjectID {
	ids := make([]primitive.ObjectID, 0, len(m))
	for id := range m {
		ids = append(ids, id)
	}
	return ids
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
