package repository

import (
	"context"
	"fmt"
	"log"

	"github.com/chera-mihiretu/IKnow/domain/constants"
	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type NotificationRepository interface {
	SendNotification(ctx context.Context, notification *models.Notifications) (error, bool)
	GetNotifications(ctx context.Context, userID string, page int) ([]models.Notifications, error)
}

type notificationRepository struct {
	notifications *mongo.Collection
}

func NewNotificationRepository(db *mongo.Database) NotificationRepository {
	return &notificationRepository{
		notifications: db.Collection("notifications"),
	}
}

func (r *notificationRepository) SendNotification(ctx context.Context, notification *models.Notifications) (error, bool) {
	// insert only if such notification with the same user_id and to is not exist
	filter := bson.M{"user_id": notification.UserID, "to": notification.To, "content_id": notification.ContentID, "type": notification.Type}

	count, err := r.notifications.CountDocuments(ctx, filter)
	if err != nil {
		return err, false
	}
	log.Println("count", count)
	if count > 0 {
		if notification.Type == string(constants.LikedYourComment) || notification.Type == string(constants.LikedYourJobPost) || notification.Type == string(constants.LikedYourPost) {
			return nil, false
		}

		updatedNotification, err := r.notifications.UpdateOne(ctx, filter, bson.M{"$set": bson.M{
			"is_read":    notification.IsRead,
			"created_at": notification.CreatedAt,
		}})
		if err != nil {
			return err, false
		}

		if updatedNotification.ModifiedCount == 0 {
			return nil, false
		}

		return nil, true

	}
	_, err = r.notifications.InsertOne(ctx, notification)

	if err != nil {
		return err, false
	}

	return nil, true
}

func (r *notificationRepository) GetNotifications(ctx context.Context, userID string, page int) ([]models.Notifications, error) {
	if page < 1 {
		page = 1
	}
	userObjectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %v", err)
	}

	pageSize := 10
	skip := int64((page - 1) * pageSize)
	limit := int64(pageSize)

	filter := bson.M{"user_id": userObjectID}
	findOptions := options.Find().
		SetSort(bson.D{{Key: "created_at", Value: -1}}).
		SetSkip(skip).
		SetLimit(limit + 1)

	cursor, err := r.notifications.Find(ctx, filter, findOptions)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var notifications []models.Notifications
	for cursor.Next(ctx) {
		var n models.Notifications
		if err := cursor.Decode(&n); err != nil {
			return nil, err
		}
		notifications = append(notifications, n)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return notifications, nil
}
