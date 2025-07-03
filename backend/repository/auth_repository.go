package repository

import (
	"context"
	"errors"
	"time"

	"github.com/chera-mihiretu/IKnow/domain/constants"
	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/infrastructure/email"
	"github.com/chera-mihiretu/IKnow/infrastructure/hashing"
	"github.com/chera-mihiretu/IKnow/infrastructure/middleware"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type AuthRepository interface {
	RegisterUserWithEmail(ctx context.Context, user models.User) error
	LoginWithEmail(ctx context.Context, user models.User) (string, error)
	SignInWithGoogle(ctx context.Context, user models.User) (string, error)
	VerifyEmail(ctx context.Context, token models.EmailVerification) error
}

type authRepository struct {
	UsersCollection           *mongo.Collection
	UsersCollectionUnverified *mongo.Collection
	VerificationsCollection   *mongo.Collection
}

func NewAuthRepository(db *mongo.Database) AuthRepository {
	return &authRepository{
		UsersCollection:           db.Collection("users"),
		UsersCollectionUnverified: db.Collection("users_temp"),
		VerificationsCollection:   db.Collection("email_verifications"),
	}
}

func (repo *authRepository) RegisterUserWithEmail(ctx context.Context, user models.User) error {
	// Check if the user already exists

	id := primitive.NewObjectID()
	user.ID = id
	userExists, err := repo.UsersCollection.CountDocuments(ctx, map[string]interface{}{
		"email": user.Email,
	})
	if err != nil {
		return errors.New("user already exists with this email")
	}
	if userExists > 0 {
		return errors.New("user already exists with this email")
	}
	user.Role = string(constants.UserRoleStudent)
	user.IsVerified = false
	user.IsTeacher = false
	user.BlueBadge = false
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	_, err = repo.UsersCollectionUnverified.InsertOne(ctx, user)

	if err != nil {
		return err
	}
	token, err := middleware.GenerateVerficationToken(user.Email)

	if err != nil {
		return errors.New("could not generate verification token")
	}
	var verification models.EmailVerification
	verification.UserID = id
	verification.Token = token
	verification.UserEmail = user.Email
	verification.SentAt = time.Now()
	verification.ExpiresAt = time.Now().Add(24 * time.Hour)

	repo.VerificationsCollection.InsertOne(ctx, verification)

	err = email.SendEmail(user.Email, token)

	if err != nil {
		return errors.New("could not send verification email")
	}

	return nil

}

func (repo *authRepository) LoginWithEmail(ctx context.Context, user models.User) (string, error) {
	filter := bson.M{"email": user.Email}
	var foundUser models.User
	err := repo.UsersCollection.FindOne(ctx, filter).Decode(&foundUser)

	if err != nil {
		return "", errors.New("user not found")
	}

	if !hashing.ComparePassword(foundUser.PasswordHash, user.PasswordHash) {
		return "", errors.New("wrong cridential or maybe the user have no password, try forgot password")
	}

	token, err := middleware.GenerateJWT(foundUser.ID.Hex(), foundUser.Role)
	if err != nil {
		return "", errors.New("could not generate JWT token")
	}

	return token, nil
}
func (repo *authRepository) SignInWithGoogle(ctx context.Context, user models.User) (string, error) {
	id := primitive.NewObjectID()
	user.ID = id
	userExists, err := repo.UsersCollection.CountDocuments(ctx, map[string]interface{}{
		"email": user.Email,
	})
	if err != nil {
		return "", errors.New("cannot check if user exists")
	}

	if userExists > 0 {
		filter := bson.M{"email": user.Email}
		var foundUser models.User
		err := repo.UsersCollection.FindOne(ctx, filter).Decode(&foundUser)

		if err != nil {
			return "", errors.New("user not found")
		}

		token, err := middleware.GenerateJWT(foundUser.ID.Hex(), foundUser.Role)
		if err != nil {
			return "", errors.New("could not generate JWT token")
		}

		return token, nil
	} else {
		id := primitive.NewObjectID()

		user.ID = id
		user.Role = string(constants.UserRoleStudent)
		user.IsVerified = false
		user.IsTeacher = false
		user.BlueBadge = false
		user.CreatedAt = time.Now()
		user.UpdatedAt = time.Now()

		_, err = repo.UsersCollection.InsertOne(ctx, user)

		if err != nil {
			return "", errors.New("could not insert user into collection")
		}

		token, err := middleware.GenerateJWT(id.Hex(), user.Role)
		if err != nil {
			return "", errors.New("could not generate JWT token")
		}

		return token, nil
	}

}
func (repo *authRepository) VerifyEmail(ctx context.Context, token models.EmailVerification) error {
	filter := bson.M{"user_email": token.UserEmail, "token": token.Token}

	var verify models.EmailVerification

	err := repo.VerificationsCollection.FindOne(ctx, filter).Decode(&verify)

	if err != nil {
		return errors.New("verification token not found")
	}

	if verify.ExpiresAt.Before(time.Now()) {
		return errors.New("verification token has expired")
	}

	filter = bson.M{"_id": verify.UserID}
	var user models.User
	err = repo.UsersCollectionUnverified.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		return errors.New("user not found")
	}

	_, err = repo.UsersCollection.InsertOne(ctx, user)

	if err != nil {
		return errors.New("could not insert user into verified collection")
	}
	filter = bson.M{"email": user.Email}
	_, err = repo.UsersCollectionUnverified.DeleteMany(ctx, filter)
	if err != nil {
		return errors.New("could not delete user from unverified collection")
	}

	filter = bson.M{"user_email": token.UserEmail}
	_, err = repo.VerificationsCollection.DeleteMany(ctx, filter)
	if err != nil {
		return errors.New("could not delete verification token")
	}
	return nil

}
