package repository

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DepartmentRepository interface {
	GetDepartments(ctx context.Context, page int) ([]models.Departments, error)
	GetDepartmentByID(ctx context.Context, id primitive.ObjectID) (models.Departments, error)
	CreateDepartment(ctx context.Context, department models.Departments) (models.Departments, error)
	UpdateDepartment(ctx context.Context, department models.Departments) (models.Departments, error)
	DeleteDepartment(ctx context.Context, id primitive.ObjectID) error
	GetDepartmentsInTree(ctx context.Context, schoolID primitive.ObjectID) ([]models.Departments, error)
}

type departmentRepository struct {
	departments *mongo.Collection
}

func NewDepartmentRepository(db *mongo.Database) DepartmentRepository {
	return &departmentRepository{
		departments: db.Collection("departments"),
	}
}

func (r *departmentRepository) GetDepartments(ctx context.Context, page int) ([]models.Departments, error) {
	var departments []models.Departments

	pageSize := Pagesize
	skip := (page - 1) * pageSize
	findOptions := options.Find().SetSkip(int64(skip)).SetLimit(int64(pageSize))

	cursor, err := r.departments.Find(ctx, bson.M{}, findOptions)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var department models.Departments
		if err := cursor.Decode(&department); err != nil {
			return nil, err
		}
		departments = append(departments, department)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return departments, nil
}

func (r *departmentRepository) GetDepartmentByID(ctx context.Context, id primitive.ObjectID) (models.Departments, error) {
	var department models.Departments
	err := r.departments.FindOne(ctx, bson.M{"_id": id}).Decode(&department)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return models.Departments{}, nil // Return an empty department if not found
		}
		return models.Departments{}, err
	}
	return department, nil
}

func (r *departmentRepository) CreateDepartment(ctx context.Context, department models.Departments) (models.Departments, error) {
	department.ID = primitive.NewObjectID() // Ensure the ID is set before insertion
	_, err := r.departments.InsertOne(ctx, department)
	if err != nil {
		return models.Departments{}, err
	}
	return department, nil
}

func (r *departmentRepository) UpdateDepartment(ctx context.Context, department models.Departments) (models.Departments, error) {
	update := bson.M{"$set": department}
	_, err := r.departments.UpdateOne(ctx, bson.M{"_id": department.ID}, update)
	if err != nil {
		return models.Departments{}, err
	}
	return department, nil
}
func (r *departmentRepository) DeleteDepartment(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.departments.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return err
	}

	if res.DeletedCount == 0 {
		return mongo.ErrNoDocuments // Return an error if no document was deleted
	}
	return nil
}

func (r *departmentRepository) GetDepartmentsInTree(ctx context.Context, schoolID primitive.ObjectID) ([]models.Departments, error) {
	var departments []models.Departments
	filter := bson.M{"school_id": schoolID}
	cursor, err := r.departments.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var department models.Departments
		if err := cursor.Decode(&department); err != nil {
			return nil, err
		}
		departments = append(departments, department)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return departments, nil
}
