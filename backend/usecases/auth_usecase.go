package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
)

type AuthUseCase interface {
	RegisterUserEmail(ctx context.Context, user models.User) error
	LoginWithEmail(ctx context.Context, user models.User) (string, error)
	SignInWithGoogle(ctx context.Context, user models.User) (string, error)
	VerifyEmail(ctx context.Context, token models.EmailVerification) error
}

type authUseCase struct {
	AuthRepository repository.AuthRepository
}

func NewAuthUseCase(repository repository.AuthRepository) AuthUseCase {
	return &authUseCase{
		AuthRepository: repository,
	}
}

// Helper for error forwarding (for future extensibility)
func forwardError(err error) error {
	return err
}

func (auth *authUseCase) RegisterUserEmail(ctx context.Context, user models.User) error {
	return forwardError(auth.AuthRepository.RegisterUserWithEmail(ctx, user))
}

func (auth *authUseCase) SignInWithGoogle(ctx context.Context, user models.User) (string, error) {
	token, err := auth.AuthRepository.SignInWithGoogle(ctx, user)
	return token, forwardError(err)
}

func (auth *authUseCase) LoginWithEmail(ctx context.Context, user models.User) (string, error) {
	token, err := auth.AuthRepository.LoginWithEmail(ctx, user)
	return token, forwardError(err)
}

func (auth *authUseCase) VerifyEmail(ctx context.Context, token models.EmailVerification) error {
	return forwardError(auth.AuthRepository.VerifyEmail(ctx, token))
}
