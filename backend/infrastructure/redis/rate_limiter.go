package redis

import (
	"context"
	"crypto/tls"
	"encoding/json"
	"log"
	"os"

	"github.com/chera-mihiretu/IKnow/domain/constants"
	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/infrastructure/email"
	"github.com/hibiken/asynq"
	"golang.org/x/time/rate"
)

func RateLimiter() {
	redisAddress := os.Getenv("REDIS_ADDR")      // e.g., redis-11889.c239.us-east-1-2.ec2.redns.redis-cloud.com:11889
	redisUsername := os.Getenv("REDIS_USERNAME") // e.g., default
	redisPassword := os.Getenv("REDIS_PASSWORD") // From Redis Cloud dashboard
	redisDB := 0                                 // Default DB, adjust if needed (convert to int if stored as string)

	server := asynq.NewServer(
		asynq.RedisClientOpt{
			Addr:     redisAddress,
			Username: redisUsername,
			Password: redisPassword,
			DB:       redisDB,
			TLSConfig: &tls.Config{
				InsecureSkipVerify: true, // Use true for testing; false in production with proper CA cert
			},
		},
		asynq.Config{
			Concurrency: 10,
			Queues: map[string]int{
				"emails": 10,
			},
		},
	)

	mux := asynq.NewServeMux()
	limiter := rate.NewLimiter(rate.Limit(5), 5)

	mux.HandleFunc(constants.TypeSendEmail, func(ctx context.Context, t *asynq.Task) error {
		var p models.Email
		if err := json.Unmarshal(t.Payload(), &p); err != nil {
			return err
		}
		if err := limiter.Wait(ctx); err != nil {
			return err
		}
		if err := email.SendEmailToUsers(p.To, p.Subject, p.Body); err != nil {
			return err
		}
		log.Printf("Email sent to %s with subject: %s", p.To, p.Subject)
		return nil
	})

	if err := server.Start(mux); err != nil {
		log.Fatalf("could not start server: %v", err)
	}

	log.Println("✅✅✅✅ Rate limiter started successfully ")
}
