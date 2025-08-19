package repository

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/infrastructure/my_websocket"
)

type WebSocketRepository interface {
	AddConnection(connection *models.SocketConnection)
	RemoveConnection(userID string)
	SendMessage(ctx context.Context, message *models.Notifications)
}

type webSocketRepository struct {
	webSocketClient *my_websocket.WebSocketClient
}

func NewWebSocketRepository(webSocketClient *my_websocket.WebSocketClient) WebSocketRepository {
	return &webSocketRepository{
		webSocketClient: webSocketClient,
	}
}

func (r *webSocketRepository) AddConnection(connection *models.SocketConnection) {
	r.webSocketClient.AddConnection(connection)
}

func (r *webSocketRepository) RemoveConnection(userID string) {
	r.webSocketClient.RemoveConnection(userID)
}

func (r *webSocketRepository) SendMessage(ctx context.Context, message *models.Notifications) {
	r.webSocketClient.SendMessage(ctx, message)
}
