package controller

import (
	"context"
	"reflect"
	"testing"

	appcontroller "github.com/chera-mihiretu/IKnow/delivery/controller"
	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/test/data"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func TestAddUsersToNotifications(t *testing.T) {
	notifications := data.TestNotificationsTyped

	userUsecase := NewUserUsecaseMock()
	notificationUsecase := NewNotificationUsecaseMock()

	cont := appcontroller.NewNotificationController(notificationUsecase, userUsecase)

	expected := data.TestNotificationsWithUsers

	actual, err := cont.NotificiationWithUser(context.Background(), notifications)
	if err != nil {
		t.Fatalf("Error getting notifications with users: %v", err)
	}

	if !reflect.DeepEqual(expected, actual) {
		t.Fatalf("mismatch notifications with users.\nexpected: %#v\nactual:   %#v", expected, actual)
	}
}

type UserUsecaseMock struct{}

type NotificationUsecaseMock struct{}

func (m *UserUsecaseMock) GetListOfUsers(ctx context.Context, userIds []primitive.ObjectID) ([]models.UserView, error) {
	return data.TestUserViews, nil
}

// Unused methods to satisfy the interface in this test context
func (m *UserUsecaseMock) GetUserById(ctx context.Context, userID string) (models.UserView, error) {
	return models.UserView{}, nil
}
func (m *UserUsecaseMock) GetUserByIdNoneView(ctx context.Context, userID string) (models.User, error) {
	return models.User{}, nil
}
func (m *UserUsecaseMock) GetUserByEmail(ctx context.Context, email string) (models.UserView, error) {
	return models.UserView{}, nil
}
func (m *UserUsecaseMock) CompleteUser(ctx context.Context, user models.User) (models.UserView, error) {
	return models.UserView{}, nil
}
func (m *UserUsecaseMock) UserAnalytics(ctx context.Context) (models.UserAnalytics, error) {
	return models.UserAnalytics{}, nil
}
func (m *UserUsecaseMock) UpdateMe(ctx context.Context, user models.User) (models.UserView, error) {
	return models.UserView{}, nil
}

func (m *NotificationUsecaseMock) SendNotification(ctx context.Context, notification *models.Notifications) error {
	return nil
}
func (m *NotificationUsecaseMock) GetNotifications(ctx context.Context, userID string, page int) ([]models.Notifications, error) {
	return data.TestNotificationsTyped, nil
}
func (m *NotificationUsecaseMock) GetUnreadNotificationsCount(ctx context.Context, userID string) (int64, error) {
	return 0, nil
}

func NewUserUsecaseMock() *UserUsecaseMock                 { return &UserUsecaseMock{} }
func NewNotificationUsecaseMock() *NotificationUsecaseMock { return &NotificationUsecaseMock{} }
