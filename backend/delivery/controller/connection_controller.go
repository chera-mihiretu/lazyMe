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

// Helper for error responses (renamed to avoid redeclaration)
func respondConnWithError(ctx *gin.Context, code int, errMsg string) {
	ctx.JSON(code, gin.H{"error": errMsg})
}

// Helper to extract user ID from context
func getConnUserID(ctx *gin.Context) (string, bool) {
	userID, exist := ctx.Get("user_id")
	if !exist {
		respondConnWithError(ctx, 400, "User ID not found in context")
		return "", false
	}
	userIDStr, ok := userID.(string)
	if !ok {
		respondConnWithError(ctx, 400, "Invalid user ID type")
		return "", false
	}
	return userIDStr, true
}

// Helper to extract and validate page query param
func getConnPage(ctx *gin.Context) (int, bool) {
	pageStr := ctx.Query("page")
	page, err := strconv.Atoi(pageStr)
	if err != nil {
		respondConnWithError(ctx, 400, "Invalid page number")
		return 0, false
	}
	return page, true
}

func (c *ConnectionController) GetConnections(ctx *gin.Context) {
	userIDStr, ok := getConnUserID(ctx)
	if !ok {
		return
	}
	page, ok := getConnPage(ctx)
	if !ok {
		return
	}
	connections, err := c.connectionUsecase.GetConnections(ctx, userIDStr, page)
	if err != nil {
		respondConnWithError(ctx, 500, "Failed to get connections")
		return
	}
	listOfConnection := []primitive.ObjectID{}
	fmt.Println(connections)
	for _, con := range connections {
		if con.ConnecteeID.Hex() == userIDStr {
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
		respondConnWithError(ctx, 500, "Failed to get user details")
		return
	}
	ctx.JSON(200, gin.H{"user": userIDStr, "connections": users, "page": page})
}

func (c *ConnectionController) GetConnectRequests(ctx *gin.Context) {
	userIDStr, ok := getConnUserID(ctx)
	if !ok {
		return
	}
	page, ok := getConnPage(ctx)
	if !ok {
		return
	}
	connectRequests, err := c.connectionUsecase.GetConnectRequests(ctx, userIDStr, page)
	if err != nil {
		respondConnWithError(ctx, 500, "Failed to get connection requests")
		return
	}
	listOfConnection := []primitive.ObjectID{}
	for _, con := range connectRequests {
		if con.ConnecteeID.Hex() == userIDStr {
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
		respondConnWithError(ctx, 500, "Failed to get user details")
		return
	}
	ctx.JSON(200, gin.H{"connections": users, "page": page})
}

func (c *ConnectionController) CreateConnection(ctx *gin.Context) {
	var connect models.Connects
	if err := ctx.ShouldBindJSON(&connect); err != nil {
		respondConnWithError(ctx, 400, "Invalid input: "+err.Error())
		return
	}
	userIDStr, ok := getConnUserID(ctx)
	if !ok {
		return
	}
	obId, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		respondConnWithError(ctx, 400, "Invalid user ID format")
		return
	}
	connect.ConnectorID = obId
	if err := c.connectionUsecase.CreateConnect(ctx, connect); err != nil {
		respondConnWithError(ctx, 500, "Failed to create connection: "+err.Error())
		return
	}
	ctx.JSON(201, gin.H{"message": "Connection created successfully"})
}

func (c *ConnectionController) DeleteConnection(ctx *gin.Context) {
	var connect models.Connects
	if err := ctx.ShouldBindJSON(&connect); err != nil {
		respondConnWithError(ctx, 400, "Invalid input: "+err.Error())
		return
	}
	userIDStr, ok := getConnUserID(ctx)
	if !ok {
		return
	}
	obId, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		respondConnWithError(ctx, 400, "Invalid user ID format")
		return
	}
	connect.ConnectorID = obId
	if err := c.connectionUsecase.DeleteConnect(ctx, connect); err != nil {
		respondConnWithError(ctx, 500, "Failed to delete connection: "+err.Error())
		return
	}
	ctx.JSON(200, gin.H{"message": "Connection deleted successfully"})
}

func (c *ConnectionController) IsConnected(ctx *gin.Context) {
	var connect models.Connects
	connector_id := ctx.Query("connector_id")
	if connector_id == "" {
		respondConnWithError(ctx, 400, "Connector ID is required")
		return
	}
	conID, err := primitive.ObjectIDFromHex(connector_id)
	if err != nil {
		respondConnWithError(ctx, 400, "Invalid connector ID format")
		return
	}
	connect.ConnecteeID = conID
	userIDStr, ok := getConnUserID(ctx)
	if !ok {
		return
	}
	obId, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		respondConnWithError(ctx, 400, "Invalid user ID format")
		return
	}
	connect.ConnectorID = obId
	isConnected, err := c.connectionUsecase.IsConnected(ctx, connect)
	if err != nil {
		respondConnWithError(ctx, 500, "Failed to check connection status: "+err.Error())
		return
	}
	ctx.JSON(200, gin.H{"is_connected": isConnected})
}

func (c *ConnectionController) GetConnectionsCount(ctx *gin.Context) {
	userIDStr, ok := getConnUserID(ctx)
	if !ok {
		return
	}
	count, err := c.connectionUsecase.GetConnectionsCount(ctx, userIDStr)
	if err != nil {
		respondConnWithError(ctx, 500, "Failed to get connections count: "+err.Error())
		return
	}
	ctx.JSON(200, gin.H{"connections_count": count})
}

func (c *ConnectionController) AcceptConnection(ctx *gin.Context) {
	var connect models.Connects
	if err := ctx.ShouldBindJSON(&connect); err != nil {
		respondConnWithError(ctx, 400, "Invalid input: "+err.Error())
		return
	}
	userIDStr, ok := getConnUserID(ctx)
	if !ok {
		return
	}
	obId, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		respondConnWithError(ctx, 400, "Invalid user ID format")
		return
	}
	connect.ConnecteeID = obId
	fmt.Println(connect)
	if err := c.connectionUsecase.AcceptConnection(ctx, connect); err != nil {
		respondConnWithError(ctx, 500, "Failed to create connection: "+err.Error())
		return
	}
	ctx.JSON(201, gin.H{"message": "Connection created successfully"})
}

func (c *ConnectionController) GetMyConnections(ctx *gin.Context) {

}
