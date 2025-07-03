package repository

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type DepartmentRepository interface {
	GetListOfDepartments(ctx context.Context, ids []primitive.ObjectID) ([]models.Departments, error)
}

type departmentRepository struct {
	departments *mongo.Collection
}

func NewDepartmentRepository(db *mongo.Database) *departmentRepository {
	return &departmentRepository{
		departments: db.Collection("departments"),
	}
}

func (r *departmentRepository) GetListOfDepartments(ctx context.Context, ids []primitive.ObjectID) ([]models.Departments, error) {
	var departments []models.Departments
	cursor, err := r.departments.Find(ctx, bson.M{
		"_id": bson.M{"$in": ids},
	})
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
