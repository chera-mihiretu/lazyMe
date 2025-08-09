package repository

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/infrastructure/email"
	"github.com/hibiken/asynq"
)

type AdminRepository interface {
	SendEmailToUsers(ctx context.Context, email models.Email) error
	ImproveEmail(ctx context.Context, email models.Email) (models.Email, error)
}

type adminRepository struct {
	geminiRepository GeminiRepository
	usersRepository  UserRepository
	redisClient      *asynq.Client
}

func NewAdminRepository(geminiRepo GeminiRepository, usersRepository UserRepository, redisClient *asynq.Client) AdminRepository {
	return &adminRepository{
		geminiRepository: geminiRepo,
		usersRepository:  usersRepository,
		redisClient:      redisClient,
	}
}

func (r *adminRepository) SendEmailToUsers(ctx context.Context, m models.Email) error {

	users, err := r.usersRepository.GetAllUsers(ctx)

	if err != nil {
		return err
	}

	for _, user := range users {

		task, err := email.NewSendEmailTask(user.Email, m.Subject, m.Body)

		if err != nil {
			return err
		}

		if _, err = r.redisClient.Enqueue(task, asynq.Queue("emails")); err != nil {
			return err
		}
	}

	return nil
}

func (r *adminRepository) ImproveEmail(ctx context.Context, m models.Email) (models.Email, error) {

	improvedSubject, err := r.geminiRepository.ImproveEmailSubject(ctx, m.Subject)
	if err != nil {
		return models.Email{}, err
	}
	improvedBody, err := r.geminiRepository.ImproveEmailBody(ctx, m.Body)
	if err != nil {
		return models.Email{}, err
	}

	return models.Email{
		Subject: improvedSubject,
		Body:    improvedBody,
	}, nil
}
