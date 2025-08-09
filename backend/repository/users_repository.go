package repository

import (
	"context"
	"errors"
	"fmt"
	"sort"
	"time"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepository interface {
	// GetUserById retrieves a user by their ID.
	GetUserByIdNoneView(ctx context.Context, userID string) (models.User, error)
	GetUserById(ctx context.Context, userID string) (models.UserView, error)
	GetUserByEmail(ctx context.Context, email string) (models.UserView, error)
	GetListOfUsers(ctx context.Context, ids []primitive.ObjectID) ([]models.UserView, error)
	CompleteUser(ctx context.Context, user models.User) (models.UserView, error)
	UserAnalytics(ctx context.Context) (models.UserAnalytics, error)
	GetAllUsers(ctx context.Context) ([]models.UserView, error)
}

type userRepository struct {
	users *mongo.Collection
}

func NewUserRepository(db *mongo.Database) *userRepository {

	return &userRepository{
		users: db.Collection("users"),
	}
}

func (c *userRepository) GetUserById(ctx context.Context, userID string) (models.UserView, error) {
	var user models.UserView
	id, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return models.UserView{}, errors.New("invalid user ID format")
	}
	err = c.users.FindOne(ctx, bson.M{"_id": id}).Decode(&user)
	if err != nil {
		return models.UserView{}, err
	}
	return user, nil
}

func (c *userRepository) GetUserByEmail(ctx context.Context, email string) (models.UserView, error) {
	var user models.UserView
	err := c.users.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		return models.UserView{}, err
	}
	return user, nil
}

func (c *userRepository) GetListOfUsers(ctx context.Context, ids []primitive.ObjectID) ([]models.UserView, error) {
	var users []models.UserView
	cursor, err := c.users.Find(ctx, bson.M{
		"_id": bson.M{"$in": ids},
	})

	if err != nil {
		return nil, err
	}

	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var user models.UserView
		if err := cursor.Decode(&user); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (c *userRepository) CompleteUser(ctx context.Context, user models.User) (models.UserView, error) {
	fmt.Println("Completing user:", user.ID)
	res, err := c.users.UpdateOne(ctx,
		bson.M{"_id": user.ID},
		bson.M{"$set": bson.M{
			"profile_image_url": user.ProfileImageURL,
			"department_id":     user.DepartmentID,
			"school_id":         user.SchoolID,
			"is_complete":       true,
		},
		})

	fmt.Println("Update result:", res, "Error:", err)
	if err != nil {
		return models.UserView{}, err
	}
	if res.MatchedCount == 0 {
		return models.UserView{}, mongo.ErrNoDocuments
	}
	var updatedUser models.UserView

	return updatedUser, nil
}

func (c *userRepository) GetUserByIdNoneView(ctx context.Context, userID string) (models.User, error) {
	var user models.User
	id, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return models.User{}, errors.New("invalid user ID format")
	}
	err = c.users.FindOne(ctx, bson.M{"_id": id}).Decode(&user)
	if err != nil {
		return models.User{}, err
	}
	return user, nil
}

func (c *userRepository) UserAnalytics(ctx context.Context) (models.UserAnalytics, error) {
	var analytics models.UserAnalytics
	now := time.Now()

	// Count all records in the "users" collection
	totalCount, err := c.users.CountDocuments(ctx, bson.M{})
	if err != nil {
		return models.UserAnalytics{}, err
	}
	analytics.TotalUsers = totalCount

	// Calculate the start and end times for the 7-day range
	startOfRange := now.AddDate(0, 0, -6).Truncate(24 * time.Hour)
	endOfRange := now.Add(24 * time.Hour)

	// Fetch all users created within the 7-day range
	cursor, err := c.users.Find(ctx, bson.M{
		"created_at": bson.M{
			"$gte": startOfRange,
			"$lt":  endOfRange,
		},
	})
	if err != nil {
		return models.UserAnalytics{}, err
	}
	defer cursor.Close(ctx)

	analytics.UserEachDay = make([]int64, 7)

	// Sort users by their creation date
	var users []models.User
	for cursor.Next(ctx) {
		var user models.User
		if err := cursor.Decode(&user); err != nil {
			return models.UserAnalytics{}, err
		}
		users = append(users, user)
	}
	if err := cursor.Err(); err != nil {
		return models.UserAnalytics{}, err
	}

	sort.Slice(users, func(i, j int) bool {
		return users[i].CreatedAt.Before(users[j].CreatedAt)
	})

	// Initialize variables
	start := 0
	for i := 0; i < len(users); i++ {
		// Check if the current user is out of the date span
		if users[i].CreatedAt.After(users[start].CreatedAt.Add(24 * time.Hour)) {
			// Count the number of users in the span
			dayIndex := int(users[start].CreatedAt.Sub(startOfRange).Hours() / 24)
			if dayIndex >= 0 && dayIndex < 7 {
				analytics.UserEachDay[dayIndex] = int64(i - start)
			}
			// Move the start pointer to the current index
			start = i
		}
	}

	// Handle the remaining users
	if start < len(users) {
		dayIndex := int(users[start].CreatedAt.Sub(startOfRange).Hours() / 24)
		if dayIndex >= 0 && dayIndex < 7 {
			analytics.UserEachDay[dayIndex] = int64(len(users) - start)
		}
	}

	return analytics, nil
}

func (c *userRepository) GetAllUsers(ctx context.Context) ([]models.UserView, error) {
	var users []models.UserView
	cursor, err := c.users.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	for cursor.Next(ctx) {
		var user models.UserView
		if err := cursor.Decode(&user); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return users, nil
}
