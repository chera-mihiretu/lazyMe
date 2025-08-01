package repository

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UniversityRepository interface {
	GetUniversities(ctx context.Context) ([]models.University, error)
	GetUniversityByID(ctx context.Context, id primitive.ObjectID) (models.University, error)
	CreateUniversity(ctx context.Context, university models.University) (models.University, error)
	UpdateUniversity(ctx context.Context, university models.University) (models.University, error)
	DeleteUniversity(ctx context.Context, id, userID primitive.ObjectID) error
	VerifyExistence(ctx context.Context, university primitive.ObjectID) (bool, error)
}

type universityRepository struct {
	database *mongo.Collection
}

func NewUniversityRepository(db *mongo.Database) UniversityRepository {
	return &universityRepository{
		database: db.Collection("universities"),
	}
}

func (r *universityRepository) GetUniversities(ctx context.Context) ([]models.University, error) {
	var universities []models.University
	cursor, err := r.database.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var university models.University
		if err := cursor.Decode(&university); err != nil {
			return nil, err
		}
		universities = append(universities, university)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return universities, nil
}

func (r *universityRepository) GetUniversityByID(ctx context.Context, id primitive.ObjectID) (models.University, error) {
	var university models.University
	err := r.database.FindOne(ctx, bson.M{"_id": id}).Decode(&university)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return models.University{}, nil
		}
		return models.University{}, err
	}
	return university, nil
}

func (r *universityRepository) CreateUniversity(ctx context.Context, university models.University) (models.University, error) {
	university.ID = primitive.NewObjectID()
	_, err := r.database.InsertOne(ctx, university)
	if err != nil {
		return models.University{}, err
	}
	return university, nil
}

func (r *universityRepository) UpdateUniversity(ctx context.Context, university models.University) (models.University, error) {
	update := bson.M{"$set": bson.M{
		"name":    university.Name,
		"country": university.City,
	}}
	res, err := r.database.UpdateOne(ctx, bson.M{"_id": university.ID}, update)
	if err != nil {
		return models.University{}, err
	}
	if res.MatchedCount == 0 {
		return models.University{}, mongo.ErrNoDocuments
	}
	return university, nil
}

func (r *universityRepository) DeleteUniversity(ctx context.Context, id, userID primitive.ObjectID) error {
	res, err := r.database.DeleteOne(ctx, bson.M{"_id": id, "created_by": userID})
	if err != nil {
		return err
	}
	if res.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}
	return nil
}

func (r *universityRepository) VerifyExistence(ctx context.Context, university primitive.ObjectID) (bool, error) {
	count, err := r.database.CountDocuments(ctx, bson.M{"_id": university})
	if err != nil {
		return false, err
	}
	return count > 0, nil
}
