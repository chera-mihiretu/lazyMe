package repository

import (
	"context"
	"errors"
	"fmt"
	"log"
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
	UpdateMe(ctx context.Context, user models.User) (models.UserView, error)
}

type userRepository struct {
	users                *mongo.Collection
	departmentCollection *mongo.Collection
	schoolCollection     *mongo.Collection
	universityCollection *mongo.Collection
}

func NewUserRepository(db *mongo.Database) *userRepository {

	return &userRepository{
		users:                db.Collection("users"),
		departmentCollection: db.Collection("departments"),
		schoolCollection:     db.Collection("schools"),
		universityCollection: db.Collection("universities"),
	}
}

func (c *userRepository) UpdateMe(ctx context.Context, user models.User) (models.UserView, error) {

	beforeUser, err := c.GetUserById(ctx, user.ID.Hex())
	if err != nil {
		return models.UserView{}, err
	}

	update := bson.M{}

	if user.Name != "" {
		update["name"] = user.Name
	}
	if user.ProfileImageURL != "" {
		update["profile_image_url"] = user.ProfileImageURL
	}
	log.Println("we are here")
	if user.UniversityID != nil && *user.UniversityID != primitive.NilObjectID {
		count, err := c.universityCollection.CountDocuments(ctx, bson.M{"_id": *user.UniversityID})
		if err != nil {
			return models.UserView{}, fmt.Errorf("university with ID %s does not exist", user.UniversityID.Hex())
		}
		if count == 0 {
			return models.UserView{}, fmt.Errorf("university with ID %s does not exist", user.UniversityID.Hex())
		}
		update["university_id"] = *user.UniversityID
		update["school_id"] = nil
		update["department_id"] = nil

	}
	log.Println("We are here at school")
	if user.SchoolID != nil && *user.SchoolID != primitive.NilObjectID {
		if _, hasUniversity := update["university_id"]; hasUniversity {
			count, err := c.schoolCollection.CountDocuments(ctx, bson.M{"_id": *user.SchoolID})
			if err != nil {
				return models.UserView{}, fmt.Errorf("school with ID %s does not exist", user.SchoolID.Hex())
			}
			if count != 0 {
				update["school_id"] = *user.SchoolID
				update["department_id"] = nil
			}
		}
	}
	log.Println("We are here at department")
	if user.DepartmentID != nil && *user.DepartmentID != primitive.NilObjectID {
		if _, hasSchool := update["school_id"]; hasSchool {
			count, err := c.departmentCollection.CountDocuments(ctx, bson.M{"_id": *user.DepartmentID})
			if err != nil {
				return models.UserView{}, fmt.Errorf("department with ID %s does not exist", user.DepartmentID.Hex())
			}
			if count != 0 {
				update["department_id"] = *user.DepartmentID
			}
		}
	}
	log.Println("We are here at acedemic year")
	if user.AcedemicYear != 0 {
		update["acedemic_year"] = user.AcedemicYear
	}

	var res *mongo.UpdateResult
	if len(update) > 0 {
		res, err = c.users.UpdateOne(ctx, bson.M{"_id": user.ID}, bson.M{"$set": update})
	} else {
		res = &mongo.UpdateResult{MatchedCount: 1}
	}

	if err != nil {
		return models.UserView{}, err
	}
	if res.MatchedCount == 0 {
		return models.UserView{}, mongo.ErrNoDocuments
	}
	var updatedUser models.UserView
	updatedUser.ID = user.ID
	updatedUser.Name = user.Name
	updatedUser.ProfileImageURL = user.ProfileImageURL
	updatedUser.AcedemicYear = user.AcedemicYear
	return beforeUser, nil
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
