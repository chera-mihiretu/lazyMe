package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	Pagesize = 10 // Number of posts per page
)

type PostRepository interface {
	GetRecomendedPosts(ctx context.Context, userID string, page int) ([]models.Posts, error)
	GetPosts(ctx context.Context, userID string, page int) ([]models.Posts, error)
	GetPostsByUserID(ctx context.Context, userID string, page int) ([]models.Posts, error)
	GetPostByID(ctx context.Context, id string) (models.Posts, error)
	CreatePost(ctx context.Context, post models.Posts) (models.Posts, error)
	UpdatePost(ctx context.Context, post models.Posts) (models.Posts, error)
	DeletePost(ctx context.Context, userID string, postID string) error
	SearchPosts(ctx context.Context, query string, page int) ([]models.Posts, error)
	GetPostsWithListOfId(ctx context.Context, postIDs []primitive.ObjectID) ([]models.Posts, error)
	GetUnverifiedPosts(ctx context.Context, page int) ([]models.Posts, error)
	VerifyPosts(ctx context.Context, postID primitive.ObjectID) error
	RemoveUnverifiedPost(ctx context.Context, postID primitive.ObjectID) error
}

type postRepository struct {
	postsDB           *mongo.Collection
	connectRepository ConnectRepository
	userRepository    UserRepository
	geminiRepository  GeminiRepository
}

func NewPostRepository(db *mongo.Database,
	department DepartmentRepository,
	connect ConnectRepository,
	userRepo userRepository,
	geminiRepo GeminiRepository) PostRepository {
	return &postRepository{
		postsDB:           db.Collection("posts"),
		connectRepository: connect,
		userRepository:    &userRepo,
		geminiRepository:  geminiRepo,
	}
}

func (r *postRepository) RemoveUnverifiedPost(ctx context.Context, postID primitive.ObjectID) error {
	filter := bson.M{"_id": postID}
	_, err := r.postsDB.DeleteOne(ctx, filter)
	if err != nil {
		return fmt.Errorf("failed to remove unverified post: %v", err)
	}
	return nil
}

func (r *postRepository) VerifyPosts(ctx context.Context, postID primitive.ObjectID) error {

	filter := bson.M{"_id": postID}
	update := bson.M{"$set": bson.M{"is_validated": true, "updated_at": time.Now()}}
	_, err := r.postsDB.UpdateOne(ctx, filter, update)
	if err != nil {
		return fmt.Errorf("failed to verify post: %v", err)
	}
	return nil
}

func (p *postRepository) GetUnverifiedPosts(ctx context.Context, page int) ([]models.Posts, error) {
	filter := bson.M{"is_validated": false}
	pageSize := Pagesize
	findOptions := options.Find().SetSkip(int64((page - 1) * pageSize)).SetLimit(int64(pageSize + 1))
	cursor, err := p.postsDB.Find(ctx, filter, findOptions)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	var posts []models.Posts
	for cursor.Next(ctx) {
		var post models.Posts
		if err := cursor.Decode(&post); err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return posts, nil
}

func (p *postRepository) GetPostsWithListOfId(ctx context.Context, postIDs []primitive.ObjectID) ([]models.Posts, error) {
	var posts []models.Posts
	cursor, err := p.postsDB.Find(ctx, bson.M{
		"_id": bson.M{"$in": postIDs},
	})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var post models.Posts
		if err := cursor.Decode(&post); err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

func (p *postRepository) GetRecomendedPosts(ctx context.Context, userID string, page int) ([]models.Posts, error) {
	// Get the user to access their departments
	user, err := p.userRepository.GetUserById(ctx, userID)
	if err != nil {
		return nil, err
	}

	var userDepartments []string
	if user.DepartmentID == nil {
		userDepartments = []string{primitive.NewObjectID().Hex()} // wrap single department in a slice
	} else {
		userDepartments = []string{user.DepartmentID.Hex()}
	}
	// wrap single department in a slice

	// Get the user's connections
	following, err := p.connectRepository.GetConnects(ctx, userID)
	if err != nil {
		return nil, err
	}

	connects := []primitive.ObjectID{}

	userObjID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	for _, row := range following {
		if row.ConnectorID == userObjID {
			connects = append(connects, row.ConnecteeID)
		} else {
			connects = append(connects, row.ConnectorID)
		}
	}

	// Pagination logic
	skip := (page - 1) * Pagesize
	limit := Pagesize

	fmt.Println("User departments:", userDepartments)

	// Build the aggregation pipeline
	pipeline := mongo.Pipeline{
		// Stage 0: Exclude posts with IsVerified=false or IsFlagged=true
		bson.D{{Key: "$match", Value: bson.M{
			"is_validated": true,
			"is_flagged":   false,
		}}},
		// Stage 1: Add a priority field
		bson.D{{Key: "$addFields", Value: bson.D{
			{Key: "priority", Value: bson.D{
				{Key: "$switch", Value: bson.D{
					{Key: "branches", Value: bson.A{
						bson.D{{Key: "case", Value: bson.D{{Key: "$in", Value: bson.A{"$user_id", connects}}}}, {Key: "then", Value: 1}},
						bson.D{{Key: "case", Value: bson.D{{Key: "$gt", Value: bson.A{bson.D{{Key: "$size", Value: bson.D{{Key: "$setIntersection", Value: bson.A{bson.D{{Key: "$ifNull", Value: bson.A{"$departements", bson.A{}}}}, userDepartments}}}}}, 0}}}}, {Key: "then", Value: 2}},
					}},
					{Key: "default", Value: 3},
				}},
			}},
		}}},
		// Stage 2: Sort by priority, then created_at (desc), likes (desc), comments (desc)
		bson.D{{Key: "$sort", Value: bson.D{
			{Key: "priority", Value: 1},
			{Key: "created_at", Value: -1},
			{Key: "likes", Value: -1},
			{Key: "comments", Value: -1},
		}}},
		// Stage 3: Pagination
		bson.D{{Key: "$skip", Value: skip}},
		bson.D{{Key: "$limit", Value: limit + 1}},
	}

	cursor, err := p.postsDB.Aggregate(ctx, pipeline)
	if err != nil {
		fmt.Println("Error in aggregation pipeline:", err)
		return nil, err
	}
	defer cursor.Close(ctx)

	var posts []models.Posts
	for cursor.Next(ctx) {
		var post models.Posts
		if err := cursor.Decode(&post); err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

func (p *postRepository) GetPosts(ctx context.Context, userID string, page int) ([]models.Posts, error) {
	return p.GetRecomendedPosts(ctx, userID, page)
}

func (p *postRepository) GetPostByID(ctx context.Context, id string) (models.Posts, error) {
	newId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return models.Posts{}, fmt.Errorf("invalid post ID format: %v", err)
	}
	filter := bson.M{"_id": newId}
	var post models.Posts
	err = p.postsDB.FindOne(ctx, filter).Decode(&post)
	if err != nil {
		return models.Posts{}, err
	}
	return post, nil
}

func (p *postRepository) CreatePost(ctx context.Context, post models.Posts) (models.Posts, error) {
	id := primitive.NewObjectID()
	post.ID = id

	validate, err := p.geminiRepository.EvaluatePost(ctx, post.Content)
	if err != nil {
		return models.Posts{}, fmt.Errorf("failed to evaluate post content: %v", err)
	}
	post.IsValidated = validate
	post.CreatedAt = time.Now()
	post.UpdatedAt = time.Now()

	_, err = p.postsDB.InsertOne(ctx, post)
	if err != nil {
		return models.Posts{}, err
	}
	return post, nil
}

func (p *postRepository) UpdatePost(ctx context.Context, post models.Posts) (models.Posts, error) {

	filter := bson.M{"_id": post.ID, "user_id": post.UserID}
	postUpdate := bson.M{
		"$set": bson.M{
			"content":    post.Content,
			"updated_at": time.Now(),
		},
	}

	res, err := p.postsDB.UpdateOne(ctx, filter, postUpdate)
	if err != nil {
		return models.Posts{}, err
	}

	if res.MatchedCount == 0 {
		return models.Posts{}, mongo.ErrNoDocuments // No document found to update
	}

	return post, nil
}

func (p *postRepository) DeletePost(ctx context.Context, userID string, postID string) error {

	newId, err := primitive.ObjectIDFromHex(postID)
	if err != nil {
		return fmt.Errorf("invalid post ID format: %v", err)
	}

	filter := bson.M{"_id": newId, "user_id": userID}

	res, err := p.postsDB.DeleteOne(ctx, filter)
	if err != nil {
		return err
	}

	if res.DeletedCount == 0 {
		return mongo.ErrNoDocuments // No document found to delete
	}

	// TODO : Delete The Images from the storage

	return nil // Implement the logic to delete a post
}

func (p *postRepository) GetPostsByUserID(ctx context.Context, userID string, page int) ([]models.Posts, error) {
	id, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID format: %v", err)
	}
	filter := bson.M{"user_id": id}

	// Pagination logic
	skip := (page - 1) * Pagesize
	limit := Pagesize

	findOptions := options.Find().SetSkip(int64(skip)).SetLimit(int64(limit))

	cursor, err := p.postsDB.Find(ctx, filter, findOptions)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var posts []models.Posts
	for cursor.Next(ctx) {
		var post models.Posts
		if err := cursor.Decode(&post); err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

func (p *postRepository) SearchPosts(ctx context.Context, query string, page int) ([]models.Posts, error) {
	skip := (page - 1) * Pagesize
	limit := Pagesize
	fmt.Println("This is query", query)
	filter := bson.M{
		"$text": bson.M{
			"$search": query,
		},
	}

	findOptions := options.Find().
		SetSkip(int64(skip)).
		SetLimit(int64(limit)).
		SetSort(bson.D{
			{Key: "created_at", Value: -1}, // Sort by recency (descending)
			{Key: "likes", Value: -1},      // Sort by likes (descending)
		})

	cursor, err := p.postsDB.Find(ctx, filter, findOptions)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var posts []models.Posts
	for cursor.Next(ctx) {
		var post models.Posts
		if err := cursor.Decode(&post); err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}
