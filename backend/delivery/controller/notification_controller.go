package controller

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type NotificationController struct {
	notificationUsecase usecases.NotificationUsecase
	userUsecase         usecases.UserUseCase
}

func NewNotificationController(notificationUsecase usecases.NotificationUsecase, userUsecase usecases.UserUseCase) *NotificationController {
	return &NotificationController{
		notificationUsecase: notificationUsecase,
		userUsecase:         userUsecase,
	}
}

func (c *NotificationController) GetNotifications(ctx *gin.Context) {
	userID := ctx.Query("userID")
	if userID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}
	pageStr := ctx.Query("page")
	if pageStr == "" {
		pageStr = "1"
	}
	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
		return
	}

	notifications, err := c.notificationUsecase.GetNotifications(ctx, userID, page)
	next := len(notifications) > repository.ConnectPageSize

	notifications = notifications[:min(len(notifications), repository.ConnectPageSize)]

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	notificationsWithUser, err := c.NotificiationWithUser(ctx.Request.Context(), notifications)

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"notifications": notificationsWithUser, "next": next, "page": page})
}

func (c *NotificationController) NotificiationWithUser(ctx context.Context, notifications []models.Notifications) ([]models.NotificationView, error) {

	userIDsMap := make(map[primitive.ObjectID]models.UserView, len(notifications))
	userIds := make([]primitive.ObjectID, 0, len(notifications))

	for _, not := range notifications {
		if _, exists := userIDsMap[not.UserID]; !exists {
			userIDsMap[not.UserID] = models.UserView{}
			userIds = append(userIds, not.UserID)
		}
		if _, exists := userIDsMap[not.To]; !exists {
			userIDsMap[not.To] = models.UserView{}
			userIds = append(userIds, not.To)
		}
	}

	users, err := c.userUsecase.GetListOfUsers(ctx, userIds)
	if err != nil {
		return []models.NotificationView{}, err
	}
	for _, user := range users {
		userIDsMap[user.ID] = user
	}

	result := make([]models.NotificationView, 0, len(notifications))

	for _, not := range notifications {
		var notification models.NotificationView

		userFrom, ok := userIDsMap[not.UserID]
		if !ok {
			return []models.NotificationView{}, fmt.Errorf("there is problem finding users notifications")
		}
		usersTo, ok := userIDsMap[not.To]
		if !ok {
			return []models.NotificationView{}, fmt.Errorf("there is problem finding users notifications")
		}

		notification.Content = not.Content
		notification.ID = not.ID
		notification.IsRead = not.IsRead
		notification.User = userFrom
		notification.To = usersTo
		notification.Type = not.Type
		notification.CreatedAt = not.CreatedAt

		result = append(result, notification)
	}

	return result, nil

}
