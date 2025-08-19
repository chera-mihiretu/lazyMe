package models

import "github.com/gorilla/websocket"

type SocketConnection struct {
	UserID    string          `json:"user_id"`
	Conn      *websocket.Conn `json:"conn"`
	Broadcast chan *Notifications
}
