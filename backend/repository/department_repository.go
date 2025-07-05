package repository

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type DepartmentRepository interface {
	GetDepartments(ctx context.Context) ([]models.Departments, error)
	GetDepartmentByID(ctx context.Context, id primitive.ObjectID) (models.Departments, error)
	CreateDepartment(ctx context.Context, department models.Departments) (models.Departments, error)
}

type departmentRepository struct {
	departments *mongo.Collection
}

func NewDepartmentRepository(db *mongo.Database) DepartmentRepository {
	return &departmentRepository{
		departments: db.Collection("departments"),
	}
}

func (r *departmentRepository) GetDepartments(ctx context.Context) ([]models.Departments, error) {
	var departments []models.Departments
	cursor, err := r.departments.Find(ctx, bson.M{})
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

// func (r *departmentRepository) GetListOfDepartments(ctx context.Context, ids []primitive.ObjectID) ([]models.Departments, error) {
// 	var departments []models.Departments
// 	cursor, err := r.departments.Find(ctx, bson.M{
// 		"_id": bson.M{"$in": ids},
// 	})
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer cursor.Close(ctx)

// 	for cursor.Next(ctx) {
// 		var department models.Departments
// 		if err := cursor.Decode(&department); err != nil {
// 			return nil, err
// 		}
// 		departments = append(departments, department)
// 	}

// 	if err := cursor.Err(); err != nil {
// 		return nil, err
// 	}

// 	return departments, nil
// }
