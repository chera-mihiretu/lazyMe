package controller

import (
	"log"
	"net/http"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type WebSocketController struct {
	webSocketUsecase usecases.WebSocketUsecase
}

func NewWebSocketController(webSocketUsecase usecases.WebSocketUsecase) *WebSocketController {
	return &WebSocketController{
		webSocketUsecase: webSocketUsecase,
	}
}

func (c *WebSocketController) Connect(ctx *gin.Context) {
	conn, err := upgrader.Upgrade(ctx.Writer, ctx.Request, nil)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upgrade to WebSocket"})
		return
	}
	userIDQuery, exist := ctx.Get("user_id")
	if !exist {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}
	userIDStr, ok := userIDQuery.(string)
	if !ok {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID type"})
		return
	}

	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	defer conn.Close()

	if userID == primitive.NilObjectID {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	connection := &models.SocketConnection{
		UserID: userID.Hex(),
		Conn:   conn,
	}

	log.Println("Connection added for user:", userID)

	c.webSocketUsecase.AddConnection(connection)

	for {
		if _, _, err := conn.ReadMessage(); err != nil {
			break
		}
	}

	log.Println("Connection closed for user:", userID)
	c.webSocketUsecase.RemoveConnection(userID.Hex())

}
