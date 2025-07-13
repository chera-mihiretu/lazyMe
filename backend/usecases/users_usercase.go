package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserUseCase interface {
	GetUserById(ctx context.Context, userID string) (models.UserView, error)
	GetUserByIdNoneView(ctx context.Context, userID string) (models.User, error)

	GetUserByEmail(ctx context.Context, email string) (models.UserView, error)
	GetListOfUsers(ctx context.Context, ids []primitive.ObjectID) ([]models.UserView, error)
	CompleteUser(ctx context.Context, user models.User) (models.UserView, error)
}

type userUseCase struct {
	userRepository repository.UserRepository
}

// GetListOfUsers implements UserUseCase.
func (u *userUseCase) GetListOfUsers(ctx context.Context, ids []primitive.ObjectID) ([]models.UserView, error) {
	return u.userRepository.GetListOfUsers(ctx, ids)
}

// GetUserByEmail implements UserUseCase.
func (u *userUseCase) GetUserByEmail(ctx context.Context, email string) (models.UserView, error) {
	return u.userRepository.GetUserByEmail(ctx, email)
}

// GetUserById implements UserUseCase.
func (u *userUseCase) GetUserById(ctx context.Context, userID string) (models.UserView, error) {
	return u.userRepository.GetUserById(ctx, userID)
}

// CompleteUser implements UserUseCase.
func (u *userUseCase) CompleteUser(ctx context.Context, user models.User) (models.UserView, error) {
	return u.userRepository.CompleteUser(ctx, user)
}

// GetUserByIdNoneView implements UserUseCase.
func (u *userUseCase) GetUserByIdNoneView(ctx context.Context, userID string) (models.User, error) {
	return u.userRepository.GetUserByIdNoneView(ctx, userID)
}

func NewUserUseCase(repository repository.UserRepository) UserUseCase {
	return &userUseCase{
		userRepository: repository,
	}
}
