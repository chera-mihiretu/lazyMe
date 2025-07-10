package repository

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MaterialsRepository interface {
	GetMaterials(ctx context.Context, userID primitive.ObjectID, page int) ([]models.Materials, error)
	GetMaterialsByID(ctx context.Context, id primitive.ObjectID) (models.Materials, error)
	CreateMaterials(ctx context.Context, materials models.Materials) (models.Materials, error)
	UpdateMaterials(ctx context.Context, materials models.Materials) (models.Materials, error)
	DeleteMaterials(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID) error
	GetMaterialsInTree(ctx context.Context, departmentID primitive.ObjectID, year int, semester int) ([]models.Materials, error)
}

type materialsRepository struct {
	materialss *mongo.Collection
}

func NewMaterialsRepository(db *mongo.Database) MaterialsRepository {
	return &materialsRepository{
		materialss: db.Collection("materials"),
	}
}

// GetMaterials implements MaterialsRepository.
func (r *materialsRepository) GetMaterials(ctx context.Context, userID primitive.ObjectID, page int) ([]models.Materials, error) {
	var materialss []models.Materials
	skip := (page - 1) * Pagesize

	pageSizeL := int64(page)

	cursor, err := r.materialss.Find(ctx, bson.M{}, options.Find().SetSkip(int64(skip)).SetLimit(pageSizeL))
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var materials models.Materials
		if err := cursor.Decode(&materials); err != nil {
			return nil, err
		}
		materialss = append(materialss, materials)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return materialss, nil
}

func (r *materialsRepository) GetMaterialsByID(ctx context.Context, id primitive.ObjectID) (models.Materials, error) {
	var materials models.Materials
	err := r.materialss.FindOne(ctx, bson.M{"_id": id}).Decode(&materials)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return models.Materials{}, nil // Return an empty materials if not found
		}
		return models.Materials{}, err
	}
	return materials, nil
}

func (r *materialsRepository) CreateMaterials(ctx context.Context, materials models.Materials) (models.Materials, error) {
	result, err := r.materialss.InsertOne(ctx, materials)
	if err != nil {
		return models.Materials{}, err
	}
	materials.ID = result.InsertedID.(primitive.ObjectID)
	return materials, nil
}

func (r *materialsRepository) UpdateMaterials(ctx context.Context, materials models.Materials) (models.Materials, error) {
	res, err := r.materialss.UpdateOne(ctx, bson.M{"_id": materials.ID, "uploaded_by": materials.UploadedBy}, bson.M{"$set": bson.M{
		"title": materials.Title,
	}})
	if err != nil {
		return models.Materials{}, err
	}
	if res.MatchedCount == 0 {
		return models.Materials{}, mongo.ErrNoDocuments // No document found to update
	}
	return materials, nil
}
func (r *materialsRepository) DeleteMaterials(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID) error {
	res, err := r.materialss.DeleteOne(ctx, bson.M{"_id": id, "uploaded_by": userID})
	if err != nil {
		return err
	}

	if res.DeletedCount == 0 {
		return mongo.ErrNoDocuments // No document found to delete
	}

	return nil
}

// GetMaterialsInTree retrieves materials for a department filtered by year and semester
func (r *materialsRepository) GetMaterialsInTree(ctx context.Context, departmentID primitive.ObjectID, year int, semester int) ([]models.Materials, error) {
	filter := bson.M{"departmentid": departmentID, "year": year, "semister": semester}
	var materials []models.Materials
	cursor, err := r.materialss.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var material models.Materials
		if err := cursor.Decode(&material); err != nil {
			return nil, err
		}
		materials = append(materials, material)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return materials, nil
}
