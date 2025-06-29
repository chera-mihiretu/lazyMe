package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/reposiroty"
)

type AuthUseCase interface {
	RegisterUserEmail(ctx context.Context, user models.User) error
	LoginWithEmail(ctx context.Context, user models.User) (string, error)
	SignInWithGoogle(ctx context.Context, user models.User) (string, error)
	VerifyEmail(ctx context.Context, token models.EmailVerification) error
}

type authUseCase struct {
	AuthRepository reposiroty.AuthRepository
}

func NewAuthUseCase(repository reposiroty.AuthRepository) AuthUseCase {
	return &authUseCase{
		AuthRepository: repository,
	}
}

func (auth *authUseCase) RegisterUserEmail(ctx context.Context, user models.User) error {
	return auth.AuthRepository.RegisterUserWithEmail(ctx, user)
}

func (auth *authUseCase) SignInWithGoogle(ctx context.Context, user models.User) (string, error) {
	return auth.AuthRepository.SignInWithGoogle(ctx, user)
}

func (auth *authUseCase) LoginWithEmail(ctx context.Context, user models.User) (string, error) {
	return auth.AuthRepository.LoginWithEmail(ctx, user)
}

func (auth *authUseCase) VerifyEmail(ctx context.Context, token models.EmailVerification) error {
	return auth.AuthRepository.VerifyEmail(ctx, token)
}
