package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ExamUseCase interface {
	GetExams(ctx context.Context, userID primitive.ObjectID, page int) ([]models.Exam, error)
	GetExamByID(ctx context.Context, id primitive.ObjectID) (models.Exam, error)
	CreateExam(ctx context.Context, exam models.Exam) (models.Exam, error)
	UpdateExam(ctx context.Context, exam models.Exam) (models.Exam, error)
	DeleteExam(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID) error
	GetExamsInTree(ctx context.Context, departmentID primitive.ObjectID, year int, semester int) ([]models.Exam, error)
}

type examUseCase struct {
	examRepository repository.ExamsRepository
}

func (e *examUseCase) GetExams(ctx context.Context, userID primitive.ObjectID, page int) ([]models.Exam, error) {
	return e.examRepository.GetExams(ctx, userID, page)
}

func (e *examUseCase) GetExamByID(ctx context.Context, id primitive.ObjectID) (models.Exam, error) {
	return e.examRepository.GetExamByID(ctx, id)
}

func (e *examUseCase) CreateExam(ctx context.Context, exam models.Exam) (models.Exam, error) {
	return e.examRepository.CreateExam(ctx, exam)
}

func (e *examUseCase) UpdateExam(ctx context.Context, exam models.Exam) (models.Exam, error) {
	return e.examRepository.UpdateExam(ctx, exam)
}

func (e *examUseCase) DeleteExam(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID) error {
	return e.examRepository.DeleteExam(ctx, userID, id)
}

func (e *examUseCase) GetExamsInTree(ctx context.Context, departmentID primitive.ObjectID, year int, semester int) ([]models.Exam, error) {
	return e.examRepository.GetExamsInTree(ctx, departmentID, year, semester)
}

func NewExamUseCase(examRepository repository.ExamsRepository) ExamUseCase {
	return &examUseCase{
		examRepository: examRepository,
	}
}
