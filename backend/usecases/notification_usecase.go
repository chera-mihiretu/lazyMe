package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
)

type NotificationUsecase interface {
	SendNotification(ctx context.Context, notification *models.Notifications) error
	GetNotifications(ctx context.Context, userID string, page int) ([]models.Notifications, error)
}

type notificationUsecase struct {
	notificationRepository repository.NotificationRepository
	webSocketUsecase       WebSocketUsecase
}

func NewNotificationUsecase(notificationRepository repository.NotificationRepository, webSocketUsecase WebSocketUsecase) NotificationUsecase {
	return &notificationUsecase{
		notificationRepository: notificationRepository,
		webSocketUsecase:       webSocketUsecase,
	}
}

func (n *notificationUsecase) SendNotification(ctx context.Context, notification *models.Notifications) error {
	err, isNew := n.notificationRepository.SendNotification(ctx, notification)
	if err != nil {
		return err
	}
	if isNew {

		n.webSocketUsecase.SendMessage(ctx, notification)
	}
	return nil
}

func (n *notificationUsecase) GetNotifications(ctx context.Context, userID string, page int) ([]models.Notifications, error) {
	return n.notificationRepository.GetNotifications(ctx, userID, page)
}
