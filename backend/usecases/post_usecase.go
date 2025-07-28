package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PostUseCase interface {
	GetPosts(ctx context.Context, userID string, page int) ([]models.Posts, error)
	GetPostByID(ctx context.Context, id string) (models.Posts, error)
	GetPostsByUserID(ctx context.Context, userID string, page int) ([]models.Posts, error)
	CreatePost(ctx context.Context, post models.Posts) (models.Posts, error)
	UpdatePost(ctx context.Context, post models.Posts) (models.Posts, error)
	DeletePost(ctx context.Context, userID string, postID string) error
	SearchPosts(ctx context.Context, query string, page int) ([]models.Posts, error)
	GetPostsWithListOfId(ctx context.Context, postIDs []primitive.ObjectID) ([]models.Posts, error)
}

type postUseCase struct {
	postRepository repository.PostRepository
}

func NewPostUseCase(repository repository.PostRepository) PostUseCase {
	return &postUseCase{
		postRepository: repository,
	}
}

func (p *postUseCase) GetPostsWithListOfId(ctx context.Context, postIDs []primitive.ObjectID) ([]models.Posts, error) {
	return p.postRepository.GetPostsWithListOfId(ctx, postIDs)
}

func (p *postUseCase) GetPostsByUserID(ctx context.Context, userID string, page int) ([]models.Posts, error) {
	return p.postRepository.GetPostsByUserID(ctx, userID, page)
}

func (p *postUseCase) GetPosts(ctx context.Context, userID string, page int) ([]models.Posts, error) {
	return p.postRepository.GetPosts(ctx, userID, page)
}
func (p *postUseCase) GetPostByID(ctx context.Context, id string) (models.Posts, error) {
	return p.postRepository.GetPostByID(ctx, id)
}
func (p *postUseCase) CreatePost(ctx context.Context, post models.Posts) (models.Posts, error) {
	return p.postRepository.CreatePost(ctx, post)
}
func (p *postUseCase) UpdatePost(ctx context.Context, post models.Posts) (models.Posts, error) {
	return p.postRepository.UpdatePost(ctx, post)
}
func (p *postUseCase) DeletePost(ctx context.Context, userID string, postID string) error {
	return p.postRepository.DeletePost(ctx, userID, postID)
}

func (p *postUseCase) SearchPosts(ctx context.Context, query string, page int) ([]models.Posts, error) {
	return p.postRepository.SearchPosts(ctx, query, page)
}
