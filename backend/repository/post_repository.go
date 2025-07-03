package repository

import (
	"context"
	"fmt"

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
	GetRecomendedPosts(ctx context.Context, userID string, page int) ([]models.PostView, error)
	GetPosts(ctx context.Context, userID string, page int) ([]models.PostView, error)
	GetPostsByUserID(ctx context.Context, userID string, page int) ([]models.PostView, error)
	GetPostByID(ctx context.Context, id string) (models.PostView, error)
	CreatePost(ctx context.Context, post models.Posts) (models.PostView, error)
	UpdatePost(ctx context.Context, id string, post models.Posts) (models.PostView, error)
	DeletePost(ctx context.Context, id string) error
}

type postRepository struct {
	postsDB           *mongo.Collection
	connectRepository ConnectRepository
	userRepository    UserRepository
}

func NewPostRepository(db *mongo.Database,
	department DepartmentRepository,
	connect ConnectRepository,
	userRepo userRepository) PostRepository {
	return &postRepository{
		postsDB:           db.Collection("posts"),
		connectRepository: connect,
		userRepository:    &userRepo,
	}
}

func (p *postRepository) GetRecomendedPosts(ctx context.Context, userID string, page int) ([]models.PostView, error) {
	following, err := p.connectRepository.GetConnects(ctx, userID)
	if err != nil {
		return nil, err // Handle error appropriately
	}

	filter := bson.M{
		"$or": []bson.M{
			{"user_id": bson.M{"$in": following}},
			{"department": bson.M{"$in": ""}},
		},
	}
	fmt.Println(filter)

	return nil, nil // Implement the logic to get recommended posts based on the filter
}

func (p *postRepository) GetPosts(ctx context.Context, userID string, page int) ([]models.PostView, error) {
	return nil, nil // Implement the logic to get all postView
}
func (p *postRepository) GetPostByID(ctx context.Context, id string) (models.PostView, error) {
	return models.PostView{}, nil // Implement the logic to get a post by ID
}
func (p *postRepository) CreatePost(ctx context.Context, post models.Posts) (models.PostView, error) {
	id := primitive.NewObjectID()
	post.ID = id
	_, err := p.postsDB.InsertOne(ctx, post)
	if err != nil {
		return models.PostView{}, err
	}

	user, err := p.userRepository.GetUserById(ctx, post.UserID.Hex())
	if err != nil {
		return models.PostView{}, fmt.Errorf("failed to get user by ID: %v", err)
	}
	postView := models.PostView{
		ID:              post.ID,
		UserID:          user,
		Content:         post.Content,
		PostAttachments: post.PostAttachments,
		IsAnnouncement:  post.IsAnnouncement,
		IsValidated:     post.IsValidated,
		IsFlagged:       post.IsFlagged,
		Likes:           post.Likes,
		Comments:        post.Comments,
		CreatedAt:       post.CreatedAt,
	}
	return postView, nil // Implement the logic to create a post
}

func (p *postRepository) UpdatePost(ctx context.Context, id string, post models.Posts) (models.PostView, error) {
	return models.PostView{}, nil // Implement the logic to update a post
}
func (p *postRepository) DeletePost(ctx context.Context, id string) error {
	return nil // Implement the logic to delete a post
}

func (p *postRepository) GetPostsByUserID(ctx context.Context, userID string, page int) ([]models.PostView, error) {
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

	var posts []models.PostView
	for cursor.Next(ctx) {
		var post models.PostView
		if err := cursor.Decode(&post); err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	user, err := p.userRepository.GetUserById(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user by ID: %v", err)
	}

	for i := range posts {
		posts[i].UserID = user
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}
