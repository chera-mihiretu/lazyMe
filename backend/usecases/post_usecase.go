package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
)

type PostUseCase interface {
	GetPosts(ctx context.Context, userID string, page int) ([]models.PostView, error)
	GetPostByID(ctx context.Context, id string) (models.PostView, error)
	GetPostsByUserID(ctx context.Context, userID string, page int) ([]models.PostView, error)
	CreatePost(ctx context.Context, post models.Posts) (models.PostView, error)
	UpdatePost(ctx context.Context, id string, post models.Posts) (models.PostView, error)
	DeletePost(ctx context.Context, id string) error
}

type postUseCase struct {
	postRepository repository.PostRepository
}

func NewPostUseCase(repository repository.PostRepository) PostUseCase {
	return &postUseCase{
		postRepository: repository,
	}
}

func (p *postUseCase) GetPostsByUserID(ctx context.Context, userID string, page int) ([]models.PostView, error) {
	return p.postRepository.GetPostsByUserID(ctx, userID, page)
}

func (p *postUseCase) GetPosts(ctx context.Context, userID string, page int) ([]models.PostView, error) {
	return p.postRepository.GetPosts(ctx, userID, page)
}
func (p *postUseCase) GetPostByID(ctx context.Context, id string) (models.PostView, error) {
	return p.postRepository.GetPostByID(ctx, id)
}
func (p *postUseCase) CreatePost(ctx context.Context, post models.Posts) (models.PostView, error) {
	return p.postRepository.CreatePost(ctx, post)
}
func (p *postUseCase) UpdatePost(ctx context.Context, id string, post models.Posts) (models.PostView, error) {
	return p.postRepository.UpdatePost(ctx, id, post)
}
func (p *postUseCase) DeletePost(ctx context.Context, id string) error {
	return p.postRepository.DeletePost(ctx, id)
}
