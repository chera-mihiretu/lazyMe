package repository

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/chera-mihiretu/IKnow/domain/constants"
	"google.golang.org/genai"
)

type GeminiRepository interface {
	EvaluatePost(ctx context.Context, post string) (bool, error)
	EvaluateJob(ctx context.Context, comment string) (bool, error)
	ImproveEmailSubject(ctx context.Context, subject string) (string, error)
	ImproveEmailBody(ctx context.Context, body string) (string, error)
}

type geminiRepository struct {
	geminiClient *genai.Client
}

func NewGeminiRepository(client *genai.Client) GeminiRepository {
	return &geminiRepository{
		geminiClient: client,
	}
}

func (r *geminiRepository) EvaluatePost(ctx context.Context, post string) (bool, error) {
	model := string(constants.GeminiModel)
	result, err := r.geminiClient.Models.GenerateContent(
		ctx,
		model,
		genai.Text(constants.GeminiPostPrompt+post),
		nil,
	)

	if err != nil {
		return false, err
	}

	resultString := result.Text()

	resultString = strings.Trim(resultString, " ")

	if resultString == constants.GeminiApproved {
		return true, nil
	}
	if resultString == constants.GeminiDeclined {
		return false, nil
	}

	return false, errors.New("unexpected response from gemini")
}

func (r *geminiRepository) EvaluateJob(ctx context.Context, job string) (bool, error) {
	model := string(constants.GeminiModel)
	fmt.Println(job)
	result, err := r.geminiClient.Models.GenerateContent(
		ctx,
		model,
		genai.Text(constants.GeminiJobPrompt+job),
		nil,
	)

	if err != nil {
		return false, err
	}

	resultString := result.Text()

	resultString = strings.Trim(resultString, " ")

	if resultString == constants.GeminiApproved {
		return true, nil
	}
	if resultString == constants.GeminiDeclined {
		return false, nil
	}

	return false, errors.New("unexpected response from gemini")
}

func (r *geminiRepository) ImproveEmailSubject(ctx context.Context, subject string) (string, error) {
	model := string(constants.GeminiModel)
	result, err := r.geminiClient.Models.GenerateContent(
		ctx,
		model,
		genai.Text(constants.GeminiImproveEmailSubject+subject),
		nil,
	)

	if err != nil {
		return "", err
	}

	resultString := result.Text()

	resultString = strings.Trim(resultString, " ")

	return resultString, nil
}

func (r *geminiRepository) ImproveEmailBody(ctx context.Context, body string) (string, error) {
	model := string(constants.GeminiModel)
	result, err := r.geminiClient.Models.GenerateContent(
		ctx,
		model,
		genai.Text(constants.GeminiImproveEmailContent+body),
		nil,
	)

	if err != nil {
		return "", err
	}

	resultString := result.Text()

	resultString = strings.Trim(resultString, " ")

	return resultString, nil
}
