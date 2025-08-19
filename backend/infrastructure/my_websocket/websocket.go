package my_websocket

import (
	"context"
	"fmt"
	"sync"

	"github.com/chera-mihiretu/IKnow/domain/models"
)

type WebSocketClient struct {
	connections map[string]*models.SocketConnection
	mutex       sync.Mutex
}

func NewWebSocketClient() *WebSocketClient {

	return &WebSocketClient{
		connections: make(map[string]*models.SocketConnection),
	}

}

func (c *WebSocketClient) AddConnection(conn *models.SocketConnection) {
	c.mutex.Lock()
	c.connections[conn.UserID] = conn
	defer c.mutex.Unlock()

}

func (c *WebSocketClient) RemoveConnection(userID string) {
	c.mutex.Lock()
	delete(c.connections, userID)
	defer c.mutex.Unlock()
}

func (c *WebSocketClient) SendMessage(ctx context.Context, notification *models.Notifications) error {
	c.mutex.Lock()
	user, ok := c.connections[notification.To.Hex()]
	c.mutex.Unlock()
	if !ok {
		return fmt.Errorf("user not found")
	}
	if user == nil {
		return fmt.Errorf("user not found")
	}

	user.Conn.WriteJSON(notification)
	return nil
}
