package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ExamsRepository interface {
	GetExams(ctx context.Context, userID primitive.ObjectID, page int) ([]models.Exam, error)
	GetExamByID(ctx context.Context, id primitive.ObjectID) (models.Exam, error)
	CreateExam(ctx context.Context, exam models.Exam) (models.Exam, error)
	UpdateExam(ctx context.Context, exam models.Exam) (models.Exam, error)
	DeleteExam(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID) error
	GetExamsInTree(ctx context.Context, departmentID primitive.ObjectID, year int, semester int) ([]models.Exam, error)
}

type examsRepository struct {
	exams      *mongo.Collection
	department *mongo.Collection
}

func NewExamsRepository(db *mongo.Database) ExamsRepository {
	return &examsRepository{
		exams:      db.Collection("exams"),
		department: db.Collection("departments"),
	}
}

func (r *examsRepository) GetExams(ctx context.Context, userID primitive.ObjectID, page int) ([]models.Exam, error) {
	var exams []models.Exam
	skip := (page - 1) * Pagesize
	pageSizeL := int64(Pagesize)

	cursor, err := r.exams.Find(ctx, bson.M{}, options.Find().SetSkip(int64(skip)).SetLimit(pageSizeL))
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var exam models.Exam
		if err := cursor.Decode(&exam); err != nil {
			return nil, err
		}
		exams = append(exams, exam)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return exams, nil
}

func (r *examsRepository) GetExamByID(ctx context.Context, id primitive.ObjectID) (models.Exam, error) {
	var exam models.Exam
	err := r.exams.FindOne(ctx, bson.M{"_id": id}).Decode(&exam)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return models.Exam{}, nil // return empty if not found
		}
		return models.Exam{}, err
	}
	return exam, nil
}

func (r *examsRepository) CreateExam(ctx context.Context, exam models.Exam) (models.Exam, error) {
	var depa models.Departments
	err := r.department.FindOne(ctx, bson.M{"_id": exam.DepartmentID}).Decode(&depa)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return models.Exam{}, errors.New("department not found")
		}
		return models.Exam{}, err
	}

	fmt.Println("Department found:", depa, " Got:", exam)

	if exam.Year > depa.Years || exam.Year < 0 {
		return models.Exam{}, errors.New("invalid year for the department")
	}

	exam.CreatedAt = time.Now()
	exam.UpdatedAt = time.Now()

	result, err := r.exams.InsertOne(ctx, exam)
	if err != nil {
		return models.Exam{}, err
	}
	exam.ID = result.InsertedID.(primitive.ObjectID)
	return exam, nil
}

func (r *examsRepository) UpdateExam(ctx context.Context, exam models.Exam) (models.Exam, error) {
	exam.UpdatedAt = time.Now()
	res, err := r.exams.UpdateOne(ctx,
		bson.M{"_id": exam.ID, "uploaded_by": exam.UploadedBy},
		bson.M{"$set": bson.M{
			"title":        exam.Title,
			"year":         exam.Year,
			"semester":     exam.Semester,
			"department_id": exam.DepartmentID,
			"updated_at":   exam.UpdatedAt,
		}})
	if err != nil {
		return models.Exam{}, err
	}
	if res.MatchedCount == 0 {
		return models.Exam{}, mongo.ErrNoDocuments
	}
	return exam, nil
}

func (r *examsRepository) DeleteExam(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID) error {
	res, err := r.exams.DeleteOne(ctx, bson.M{"_id": id, "uploaded_by": userID})
	if err != nil {
		return err
	}
	if res.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}
	return nil
}

func (r *examsRepository) GetExamsInTree(ctx context.Context, departmentID primitive.ObjectID, year int, semester int) ([]models.Exam, error) {
	filter := bson.M{"department_id": departmentID, "year": year, "semester": semester}
	var exams []models.Exam
	cursor, err := r.exams.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var exam models.Exam
		if err := cursor.Decode(&exam); err != nil {
			return nil, err
		}
		exams = append(exams, exam)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return exams, nil
}
