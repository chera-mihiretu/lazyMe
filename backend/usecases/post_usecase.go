package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/reposiroty"
)

type PostUseCase interface {
	GetPosts(ctx context.Context, userID string) ([]models.Posts, error)
	GetPostByID(ctx context.Context, id string) (models.Posts, error)
	CreatePost(ctx context.Context, post models.Posts) (models.Posts, error)
	UpdatePost(ctx context.Context, id string, post models.Posts) (models.Posts, error)
	DeletePost(ctx context.Context, id string) error
}

type postUseCase struct {
	postRepository reposiroty.PostRepository
}

func NewPostUseCase(repository reposiroty.PostRepository) PostUseCase {
	return &postUseCase{
		postRepository: repository,
	}
}

func (p *postUseCase) GetPosts(ctx context.Context, userID string) ([]models.Posts, error) {
	return p.postRepository.GetPosts(ctx, userID)
}
func (p *postUseCase) GetPostByID(ctx context.Context, id string) (models.Posts, error) {
	return p.postRepository.GetPostByID(ctx, id)
}
func (p *postUseCase) CreatePost(ctx context.Context, post models.Posts) (models.Posts, error) {
	return p.postRepository.CreatePost(ctx, post)
}
func (p *postUseCase) UpdatePost(ctx context.Context, id string, post models.Posts) (models.Posts, error) {
	return p.postRepository.UpdatePost(ctx, id, post)
}
func (p *postUseCase) DeletePost(ctx context.Context, id string) error {
	return p.postRepository.DeletePost(ctx, id)
}
