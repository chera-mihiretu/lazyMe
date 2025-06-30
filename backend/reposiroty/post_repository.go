package reposiroty

import (
	"context"
	"fmt"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type PostRepository interface {
	GetRecomendedPosts(ctx context.Context, userID string) ([]models.Posts, error)
	GetPosts(ctx context.Context, userID string) ([]models.Posts, error)
	GetPostByID(ctx context.Context, id string) (models.Posts, error)
	CreatePost(ctx context.Context, post models.Posts) (models.Posts, error)
	UpdatePost(ctx context.Context, id string, post models.Posts) (models.Posts, error)
	DeletePost(ctx context.Context, id string) error
}

type postRepository struct {
	posts  *mongo.Collection
	follow ConnectRepository
}

func NewPostRepository(db *mongo.Database, follow ConnectRepository) PostRepository {
	return &postRepository{
		posts:  db.Collection("posts"),
		follow: follow,
	}
}

func (p *postRepository) GetRecomendedPosts(ctx context.Context, userID string) ([]models.Posts, error) {
	following, err := p.follow.GetConnects(ctx, userID)
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

func (p *postRepository) GetPosts(ctx context.Context, userID string) ([]models.Posts, error) {
	return nil, nil // Implement the logic to get all posts
}
func (p *postRepository) GetPostByID(ctx context.Context, id string) (models.Posts, error) {
	return models.Posts{}, nil // Implement the logic to get a post by ID
}
func (p *postRepository) CreatePost(ctx context.Context, post models.Posts) (models.Posts, error) {
	return models.Posts{}, nil // Implement the logic to create a post
}

func (p *postRepository) UpdatePost(ctx context.Context, id string, post models.Posts) (models.Posts, error) {
	return models.Posts{}, nil // Implement the logic to update a post
}
func (p *postRepository) DeletePost(ctx context.Context, id string) error {
	return nil // Implement the logic to delete a post
}
