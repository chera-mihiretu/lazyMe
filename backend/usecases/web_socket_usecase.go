package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
)

type WebSocketUsecase interface {
	AddConnection(connection *models.SocketConnection)
	RemoveConnection(userID string)
	SendMessage(ctx context.Context, message *models.Notifications)
}

type webSocketUsecase struct {
	webSocketRepository repository.WebSocketRepository
}

func NewWebSocketUsecase(webSocketRepository repository.WebSocketRepository) WebSocketUsecase {
	return &webSocketUsecase{
		webSocketRepository: webSocketRepository,
	}
}

func (u *webSocketUsecase) AddConnection(connection *models.SocketConnection) {
	u.webSocketRepository.AddConnection(connection)
}

func (u *webSocketUsecase) RemoveConnection(userID string) {
	u.webSocketRepository.RemoveConnection(userID)
}

func (u *webSocketUsecase) SendMessage(ctx context.Context, message *models.Notifications) {
	u.webSocketRepository.SendMessage(ctx, message)
}
