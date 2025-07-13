package controller

import (
	"fmt"
	"strconv"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ConnectionController struct {
	connectionUsecase usecases.ConnectUsecase
	userUsecase       usecases.UserUseCase
}

func NewConnectController(connect usecases.ConnectUsecase, userUsecase usecases.UserUseCase) *ConnectionController {
	return &ConnectionController{
		connectionUsecase: connect,
		userUsecase:       userUsecase,
	}
}

func (c *ConnectionController) GetConnectionSuggestions(ctx *gin.Context) {
	pageStr := ctx.Query("page")
	page, err := strconv.Atoi(pageStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid page number"})
		return
	}
	// Get the user ID from the context
	if page <= 0 {
		page = 1
	}

	userID, exist := ctx.Get("user_id")
	if !exist {
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		ctx.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}

	suggestions, err := c.connectionUsecase.GetConnectionSuggestions(ctx, userIDStr, page)
	if err != nil {
		fmt.Println("Error getting connection suggestions:", err)
		ctx.JSON(500, gin.H{"error": "Failed to get connection suggestions"})
		return
	}

	if len(suggestions) == 0 {
		ctx.JSON(200, gin.H{"suggestions": []string{}})
		return
	}

	objectIDs := []primitive.ObjectID{}
	for _, suggestion := range suggestions {
		id, err := primitive.ObjectIDFromHex(suggestion)
		if err != nil {
			ctx.JSON(400, gin.H{"error": "Invalid suggestion ID format"})
			return
		}
		objectIDs = append(objectIDs, id)
	}
	users, err := c.userUsecase.GetListOfUsers(ctx, objectIDs)

	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to get user details"})
		return
	}

	ctx.JSON(200, gin.H{
		"suggestions": users,
	})
}

func (c *ConnectionController) GetConnections(ctx *gin.Context) {

	userID, exist := ctx.Get("user_id")
	if !exist {
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		ctx.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}
	pageStr := ctx.Query("page")
	page, err := strconv.Atoi(pageStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid page number"})
		return
	}
	connections, err := c.connectionUsecase.GetConnections(ctx, userIDStr, page)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to get connections"})
		return
	}

	listOfConnection := []primitive.ObjectID{}

	fmt.Println(connections)
	for _, con := range connections {
		if con.ConnecteeID.Hex() == userID {
			listOfConnection = append(listOfConnection, con.ConnectorID)
		} else {
			listOfConnection = append(listOfConnection, con.ConnecteeID)
		}

	}

	if len(listOfConnection) == 0 {
		ctx.JSON(200, gin.H{"connections": []string{}, "page": page})
		return
	}

	users, err := c.userUsecase.GetListOfUsers(ctx, listOfConnection)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to get user details"})
		return
	}

	ctx.JSON(200, gin.H{
		"user":        userIDStr,
		"connections": users,
		"page":        page,
	})

}

func (c *ConnectionController) GetConnectRequests(ctx *gin.Context) {
	userID, exist := ctx.Get("user_id")

	if !exist {
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		ctx.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}
	pageStr := ctx.Query("page")
	page, err := strconv.Atoi(pageStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid page number"})
		return
	}

	connectRequests, err := c.connectionUsecase.GetConnectRequests(ctx, userIDStr, page)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to get connection requests"})
		return
	}

	listOfConnection := []primitive.ObjectID{}

	for _, con := range connectRequests {
		if con.ConnecteeID.Hex() == userID {
			listOfConnection = append(listOfConnection, con.ConnectorID)
		} else {
			listOfConnection = append(listOfConnection, con.ConnecteeID)
		}
	}

	if len(listOfConnection) == 0 {
		ctx.JSON(200, gin.H{"connections": []string{}, "page": page})
		return
	}

	users, err := c.userUsecase.GetListOfUsers(ctx, listOfConnection)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to get user details"})
		return
	}

	ctx.JSON(200, gin.H{
		"connections": users,
		"page":        page,
	})
}

func (c *ConnectionController) CreateConnection(ctx *gin.Context) {
	var connect models.Connects
	if err := ctx.ShouldBindJSON(&connect); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	userID, exist := ctx.Get("user_id")
	if !exist {
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		ctx.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}

	obId, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid user ID format"})
		return
	}

	connect.ConnectorID = obId

	err = c.connectionUsecase.CreateConnect(ctx, connect)

	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to create connection: " + err.Error()})
		return
	}
	ctx.JSON(201, gin.H{"message": "Connection created successfully"})

}

func (c *ConnectionController) DeleteConnection(ctx *gin.Context) {
	var connect models.Connects
	if err := ctx.ShouldBindJSON(&connect); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	userID, exist := ctx.Get("user_id")
	if !exist {
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		ctx.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}

	obId, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid user ID format"})
		return
	}

	connect.ConnectorID = obId

	err = c.connectionUsecase.DeleteConnect(ctx, connect)

	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to delete connection: " + err.Error()})
		return
	}
	ctx.JSON(200, gin.H{"message": "Connection deleted successfully"})
}

func (c *ConnectionController) IsConnected(ctx *gin.Context) {
	var connect models.Connects
	connector_id := ctx.Query("connector_id")
	if connector_id == "" {
		ctx.JSON(400, gin.H{"error": "Connector ID is required"})
		return
	}

	conID, err := primitive.ObjectIDFromHex(connector_id)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid connector ID format"})
		return
	}

	connect.ConnecteeID = conID

	userID, exist := ctx.Get("user_id")
	if !exist {
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		ctx.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}

	obId, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid user ID format"})
		return
	}

	connect.ConnectorID = obId

	isConnected, err := c.connectionUsecase.IsConnected(ctx, connect)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to check connection status: " + err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"is_connected": isConnected})
}

func (c *ConnectionController) GetConnectionsCount(ctx *gin.Context) {

	userID, exist := ctx.Get("user_id")
	if !exist {
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		ctx.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}

	count, err := c.connectionUsecase.GetConnectionsCount(ctx, userIDStr)

	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to get connections count: " + err.Error()})
		return
	}

	ctx.JSON(200, gin.H{"connections_count": count})
}

func (c *ConnectionController) AcceptConnection(ctx *gin.Context) {
	var connect models.Connects
	if err := ctx.ShouldBindJSON(&connect); err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid input: " + err.Error()})
		return
	}

	userID, exist := ctx.Get("user_id")
	if !exist {
		ctx.JSON(400, gin.H{"error": "User ID not found in context"})
		return
	}
	fmt.Println(connect)
	userIDStr, ok := userID.(string)
	if !ok {
		ctx.JSON(400, gin.H{"error": "Invalid user ID type"})
		return
	}

	obId, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Invalid user ID format"})
		return
	}

	connect.ConnecteeID = obId
	fmt.Println(connect)
	err = c.connectionUsecase.AcceptConnection(ctx, connect)

	if err != nil {
		ctx.JSON(500, gin.H{"error": "Failed to create connection: " + err.Error()})
		return
	}
	ctx.JSON(201, gin.H{"message": "Connection created successfully"})
}

func (c *ConnectionController) GetMyConnections(ctx *gin.Context) {

}
