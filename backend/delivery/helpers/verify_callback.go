package helpers

import (
	"context"
	"log"
	"os"

	"github.com/markbates/goth"
	"google.golang.org/api/idtoken"
)

func VerifyCallback(user goth.User) bool {
	payload, err := idtoken.Validate(context.Background(), user.IDToken, os.Getenv("GOOGLE_CLIENT_ID"))
	if err != nil {
		log.Printf("Failed to verify Google ID token: %v", err)
		return false
	}

	// Verify issuer and user ID
	if payload.Issuer != "https://accounts.google.com" {
		log.Printf("Invalid issuer: %s", payload.Issuer)
		return false
	}
	if payload.Subject != user.UserID {
		log.Printf("User ID mismatch: token=%s, user=%s", payload.Subject, user.UserID)
		return false
	}

	return true
}
