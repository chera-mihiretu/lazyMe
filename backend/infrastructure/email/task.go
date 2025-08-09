package email

import (
	"encoding/json"
	"log"
	"time"

	"github.com/chera-mihiretu/IKnow/domain/constants"
	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/hibiken/asynq"
)

func NewSendEmailTask(to, subject, body string) (*asynq.Task, error) {
	payload, err := json.Marshal(models.Email{
		To:      to,
		Subject: subject,
		Body:    body,
	})
	if err != nil {
		log.Println("Failed to marshal email payload:", err)
		return nil, err
	}

	t := asynq.NewTask(constants.TypeSendEmail, payload, asynq.MaxRetry(5), asynq.Timeout(30*time.Second))

	return t, nil

}
