package main

import (
	"context"
	"net/http"
	"os"

	"github.com/gorilla/sessions"
	"github.com/markbates/goth"
	"github.com/markbates/goth/gothic"
	"github.com/markbates/goth/providers/google"
	"google.golang.org/genai"
)

func GothSetup() {

	store := sessions.NewCookieStore([]byte(os.Getenv("SESSION_SECRET")))

	store.Options = &sessions.Options{
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		MaxAge:   38400, // 1 hour
		SameSite: http.SameSiteLaxMode,
	}

	gothic.Store = store

	goth.UseProviders(
		google.New(
			os.Getenv("GOOGLE_CLIENT_ID"),
			os.Getenv("GOOGLE_CLIENT_SECRET"),
			"http://localhost:8080/api/auth/google/callback",
			"email",
			"profile",
		),
	)
}

func GeminiClient(ctx context.Context) (*genai.Client, error) {
	client, err := genai.NewClient(ctx, nil)
	if err != nil {
		return nil, err
	}

	return client, nil
}
