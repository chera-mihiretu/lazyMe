package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
)

type AdminUsecase interface {
	ImproveEmail(ctx context.Context, email models.Email) (models.Email, error)
	SendEmailToUsers(ctx context.Context, email models.Email) error
}
type adminUsecase struct {
	adminRepository repository.AdminRepository
}

func NewAdminUseCase(adminRepository repository.AdminRepository) AdminUsecase {
	return &adminUsecase{
		adminRepository: adminRepository,
	}
}

func (u *adminUsecase) ImproveEmail(ctx context.Context, email models.Email) (models.Email, error) {
	return u.adminRepository.ImproveEmail(ctx, email)
}

func (u *adminUsecase) SendEmailToUsers(ctx context.Context, email models.Email) error {
	return u.adminRepository.SendEmailToUsers(ctx, email)
}
