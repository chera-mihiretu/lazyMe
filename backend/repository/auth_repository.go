package repository

import (
	"context"
	"errors"
	"fmt"
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
	ForgotPassword(ctx context.Context, user models.User) error
	ResetPassword(ctx context.Context, user models.User, token models.EmailVerification) error
}

type authRepository struct {
	UsersCollection           *mongo.Collection
	UsersCollectionUnverified *mongo.Collection
	VerificationsCollection   *mongo.Collection
	PasswordResetsCollection  *mongo.Collection
	universityRepository      UniversityRepository
}

func NewAuthRepository(db *mongo.Database, universityRepo UniversityRepository) AuthRepository {
	return &authRepository{
		UsersCollection:           db.Collection("users"),
		UsersCollectionUnverified: db.Collection("users_temp"),
		VerificationsCollection:   db.Collection("email_verifications"),
		PasswordResetsCollection:  db.Collection("password_resets"),
		universityRepository:      universityRepo,
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
	if user.AcedemicYear == 0 {
		user.AcedemicYear = 1
	}
	user.IsVerified = false
	user.IsTeacher = false
	user.BlueBadge = false
	user.IsComplete = false
	if user.UniversityID != nil && user.UniversityID.Hex() != "" {
		exist, err := repo.universityRepository.VerifyExistence(ctx, *user.UniversityID)
		if err != nil {

			return errors.New("could not verify university existence")
		}
		if exist {
			user.IsComplete = true
		}
	}
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

	err = email.SendVerificationEmail(user.Email, token)

	if err != nil {
		return errors.New("could not send verification email")
	}

	return nil

}

func (repo *authRepository) LoginWithEmail(ctx context.Context, user models.User) (string, error) {
	filter := bson.M{"email": user.Email}
	var foundUser models.User
	err := repo.UsersCollection.FindOne(ctx, filter).Decode(&foundUser)
	fmt.Println("Found user:", foundUser, "Error:", err)
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
			return "", errors.New("user not found" + err.Error())
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

	count, err := repo.UsersCollection.CountDocuments(ctx, bson.M{})
	if err != nil {
		return errors.New("could not count user documents")
	}

	if count == 0 {
		user.Role = string(constants.UserRoleSuperAdmin)
		user.IsVerified = true
		user.IsComplete = true
	}
	// TODO : Fix the concurent issue if may occur
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

func (repo *authRepository) ForgotPassword(ctx context.Context, user models.User) error {

	var newUser models.User

	err := repo.UsersCollection.FindOne(ctx, bson.M{"email": user.Email}).Decode(&newUser)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return errors.New("user not found")
		}
		return err
	}

	token, err := middleware.GenerateVerficationToken(newUser.Email)

	if err != nil {
		return errors.New("could not generate verification token")
	}

	var verification models.EmailVerification
	verification.UserID = newUser.ID
	verification.Token = token
	verification.UserEmail = user.Email
	verification.SentAt = time.Now()
	verification.ExpiresAt = time.Now().Add(24 * time.Hour)

	err = email.SendPasswordResetEmail(newUser.Email, token)
	if err != nil {
		return errors.New("could not send password reset email")
	}
	_, err = repo.PasswordResetsCollection.InsertOne(ctx, verification)

	if err != nil {
		return errors.New("could not insert password reset token")
	}
	return nil
}

func (repo *authRepository) ResetPassword(ctx context.Context, theUser models.User, token models.EmailVerification) error {
	filter := bson.M{"user_email": token.UserEmail, "token": token.Token}

	var reset models.EmailVerification

	err := repo.PasswordResetsCollection.FindOne(ctx, filter).Decode(&reset)

	if err != nil {
		return errors.New("password reset token Invalid")
	}

	if reset.ExpiresAt.Before(time.Now()) {
		return errors.New("password reset token has expired")
	}

	filter = bson.M{"_id": reset.UserID}

	newPass, err := hashing.HashPassword(theUser.PasswordHash)
	if err != nil {
		return errors.New("could not hash new password")
	}
	_, err = repo.UsersCollection.UpdateOne(ctx, filter, bson.M{"$set": bson.M{"password_hash": newPass}})
	if err != nil {
		return errors.New("could not update password")
	}
	_, err = repo.PasswordResetsCollection.DeleteMany(ctx, bson.M{"user_email": reset.UserEmail})
	if err != nil {
		return errors.New("could not delete password reset tokens")
	}
	return nil

}
