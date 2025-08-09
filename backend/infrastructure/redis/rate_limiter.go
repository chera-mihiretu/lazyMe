package redis

import (
	"context"
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
	redisAdress := os.Getenv("REDIS_ADDRESS")
	server := asynq.NewServer(
		asynq.RedisClientOpt{
			Addr: redisAdress,
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

		log.Printf("could not start server: %v", err)
		log.Fatalf("could not start server: %v", err)
	}

	log.Println("✅✅✅✅ Rate limiter started successfully ")

}
