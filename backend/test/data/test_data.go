package data

import (
	"time"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Stable ObjectIDs for test fixtures
var (
	UserAliceID = mustObjectID("66f1a1a1a1a1a1a1a1a1a1a1")
	UserBobID   = mustObjectID("66f2b2b2b2b2b2b2b2b2b2b2")
)

// TestUsers provides two sample users
var TestUsers = []map[string]interface{}{
	{
		"_id":               UserAliceID,
		"name":              "Alice Student",
		"email":             "alice@example.com",
		"google_id":         "",
		"password_hash":     "$2a$10$1b8nO3Q9u1rA9pQO4o8q8eT3WnZ5gqv7rW8tq7m5xVwVx3oQ3yM2S",
		"role":              "student",
		"follow_count":      12,
		"acedemic_year":     2,
		"profile_image_url": "https://example.com/alice.png",
		"is_complete":       true,
		"is_verified":       true,
		"is_teacher":        false,
		"blue_badge":        false,
		"created_at":        time.Date(2025, 7, 1, 10, 0, 0, 0, time.UTC),
		"updated_at":        time.Date(2025, 7, 1, 10, 0, 0, 0, time.UTC),
	},
	{
		"_id":               UserBobID,
		"name":              "Bob Teacher",
		"email":             "bob@example.com",
		"google_id":         "",
		"password_hash":     "$2a$10$1b8nO3Q9u1rA9pQO4o8q8eT3WnZ5gqv7rW8tq7m5xVwVx3oQ3yM2S",
		"role":              "teacher",
		"follow_count":      45,
		"acedemic_year":     0,
		"profile_image_url": "https://example.com/bob.png",
		"is_complete":       true,
		"is_verified":       true,
		"is_teacher":        true,
		"blue_badge":        true,
		"created_at":        time.Date(2025, 7, 1, 10, 0, 0, 0, time.UTC),
		"updated_at":        time.Date(2025, 7, 1, 10, 0, 0, 0, time.UTC),
	},
}

// TestNotifications provides sample notifications for the users
var TestNotifications = []map[string]interface{}{
	{
		"_id":        mustObjectID("66faaa111111111111111111"),
		"user_id":    UserAliceID,
		"type":       "comment",
		"content":    "Bob commented on your post: Nice post!",
		"is_read":    false,
		"created_at": primitive.NewDateTimeFromTime(time.Date(2025, 7, 9, 12, 0, 0, 0, time.UTC)),
	},
	{
		"_id":        mustObjectID("66faaa222222222222222222"),
		"user_id":    UserAliceID,
		"type":       "like-post",
		"content":    "Bob liked your post",
		"is_read":    true,
		"created_at": primitive.NewDateTimeFromTime(time.Date(2025, 7, 9, 12, 5, 0, 0, time.UTC)),
	},
	{
		"_id":        mustObjectID("66faaa333333333333333333"),
		"user_id":    UserBobID,
		"type":       "sent-connection-request",
		"content":    "Alice sent you a connection request",
		"is_read":    false,
		"created_at": primitive.NewDateTimeFromTime(time.Date(2025, 7, 9, 12, 10, 0, 0, time.UTC)),
	},
	{
		"_id":        mustObjectID("66faaa444444444444444444"),
		"user_id":    UserBobID,
		"type":       "connection-accepted",
		"content":    "Alice accepted your connection request",
		"is_read":    false,
		"created_at": primitive.NewDateTimeFromTime(time.Date(2025, 7, 9, 12, 15, 0, 0, time.UTC)),
	},
}

// Typed fixtures derived from the same data above
var TestUserViews = []models.UserView{
	{
		ID:              UserAliceID,
		Name:            "Alice Student",
		Email:           "alice@example.com",
		GoogleID:        "",
		FollowCount:     12,
		AcedemicYear:    2,
		ProfileImageURL: "https://example.com/alice.png",
		IsComplete:      true,
		IsTeacher:       false,
		BlueBadge:       false,
		CreatedAt:       time.Date(2025, 7, 1, 10, 0, 0, 0, time.UTC),
		UpdatedAt:       time.Date(2025, 7, 1, 10, 0, 0, 0, time.UTC),
	},
	{
		ID:              UserBobID,
		Name:            "Bob Teacher",
		Email:           "bob@example.com",
		GoogleID:        "",
		FollowCount:     45,
		AcedemicYear:    0,
		ProfileImageURL: "https://example.com/bob.png",
		IsComplete:      true,
		IsTeacher:       true,
		BlueBadge:       true,
		CreatedAt:       time.Date(2025, 7, 1, 10, 0, 0, 0, time.UTC),
		UpdatedAt:       time.Date(2025, 7, 1, 10, 0, 0, 0, time.UTC),
	},
}

var TestNotificationsTyped = []models.Notifications{
	{
		ID:        mustObjectID("66faaa111111111111111111"),
		UserID:    UserAliceID,
		Type:      "comment",
		Content:   "Bob commented on your post: Nice post!",
		IsRead:    false,
		CreatedAt: time.Date(2025, 7, 9, 12, 0, 0, 0, time.UTC),
	},
	{
		ID:        mustObjectID("66faaa222222222222222222"),
		UserID:    UserAliceID,
		Type:      "like-post",
		Content:   "Bob liked your post",
		IsRead:    true,
		CreatedAt: time.Date(2025, 7, 9, 12, 5, 0, 0, time.UTC),
	},
	{
		ID:        mustObjectID("66faaa333333333333333333"),
		UserID:    UserBobID,
		Type:      "sent-connection-request",
		Content:   "Alice sent you a connection request",
		IsRead:    false,
		CreatedAt: time.Date(2025, 7, 9, 12, 10, 0, 0, time.UTC),
	},
	{
		ID:        mustObjectID("66faaa444444444444444444"),
		UserID:    UserBobID,
		Type:      "connection-accepted",
		Content:   "Alice accepted your connection request",
		IsRead:    false,
		CreatedAt: time.Date(2025, 7, 9, 12, 15, 0, 0, time.UTC),
	},
}

var TestNotificationsWithUsers = []models.NotificationView{
	{
		ID:        mustObjectID("66faaa111111111111111111"),
		User:      TestUserViews[0],
		To:        TestUserViews[1],
		Type:      "comment",
		Content:   "Bob commented on your post: Nice post!",
		IsRead:    false,
		CreatedAt: time.Date(2025, 7, 9, 12, 0, 0, 0, time.UTC),
	},
	{
		ID:        mustObjectID("66faaa222222222222222222"),
		User:      TestUserViews[0],
		To:        TestUserViews[1],
		Type:      "like-post",
		Content:   "Bob liked your post",
		IsRead:    true,
		CreatedAt: time.Date(2025, 7, 9, 12, 5, 0, 0, time.UTC),
	},
	{
		ID:        mustObjectID("66faaa333333333333333333"),
		User:      TestUserViews[1],
		To:        TestUserViews[0],
		Type:      "sent-connection-request",
		Content:   "Alice sent you a connection request",
		IsRead:    false,
		CreatedAt: time.Date(2025, 7, 9, 12, 10, 0, 0, time.UTC),
	},
	{
		ID:        mustObjectID("66faaa444444444444444444"),
		User:      TestUserViews[1],
		To:        TestUserViews[0],
		Type:      "connection-accepted",
		Content:   "Alice accepted your connection request",
		IsRead:    false,
		CreatedAt: time.Date(2025, 7, 9, 12, 15, 0, 0, time.UTC),
	},
}

func mustObjectID(hex string) primitive.ObjectID {
	id, err := primitive.ObjectIDFromHex(hex)
	if err != nil {
		panic(err)
	}
	return id
}
