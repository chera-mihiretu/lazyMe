package repository

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type SchoolRepository interface {
	GetSchools(ctx context.Context, universityID primitive.ObjectID, page int) ([]models.School, error)
	GetSchoolByID(ctx context.Context, id primitive.ObjectID) (models.School, error)
	CreateSchool(ctx context.Context, school models.School) (models.School, error)
	UpdateSchool(ctx context.Context, school models.School) (models.School, error)
	DeleteSchool(ctx context.Context, id primitive.ObjectID) error
}

type schoolRepository struct {
	schools *mongo.Collection
}

func NewSchoolRepository(db *mongo.Database) SchoolRepository {
	return &schoolRepository{
		schools: db.Collection("schools"),
	}
}

func (r *schoolRepository) GetSchools(ctx context.Context, universityID primitive.ObjectID, page int) ([]models.School, error) {
	filter := bson.M{"university_id": universityID}
	var schools []models.School

	pageSize := Pagesize
	skip := (page - 1) * pageSize
	findOptions := options.Find().SetSkip(int64(skip)).SetLimit(int64(pageSize))

	cursor, err := r.schools.Find(ctx, filter, findOptions)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var school models.School
		if err := cursor.Decode(&school); err != nil {
			return nil, err
		}
		schools = append(schools, school)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return schools, nil
}

func (r *schoolRepository) GetSchoolByID(ctx context.Context, id primitive.ObjectID) (models.School, error) {
	var school models.School
	err := r.schools.FindOne(ctx, bson.M{"_id": id}).Decode(&school)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return models.School{}, nil
		}
		return models.School{}, err
	}
	return school, nil
}

func (r *schoolRepository) CreateSchool(ctx context.Context, school models.School) (models.School, error) {
	school.ID = primitive.NewObjectID()
	_, err := r.schools.InsertOne(ctx, school)
	if err != nil {
		return models.School{}, err
	}
	return school, nil
}

func (r *schoolRepository) UpdateSchool(ctx context.Context, school models.School) (models.School, error) {
	update := bson.M{"$set": bson.M{
		"name":          school.Name,
		"description":   school.Description,
		"university_id": school.UniversityID,
	}}
	res, err := r.schools.UpdateOne(ctx, bson.M{"_id": school.ID}, update)
	if err != nil {
		return models.School{}, err
	}
	if res.MatchedCount == 0 {
		return models.School{}, mongo.ErrNoDocuments
	}
	return school, nil
}

func (r *schoolRepository) DeleteSchool(ctx context.Context, id primitive.ObjectID) error {
	res, err := r.schools.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return err
	}
	if res.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}
	return nil
}
