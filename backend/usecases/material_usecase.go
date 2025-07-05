package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MaterialUseCase interface {
	GetMaterials(ctx context.Context, userID primitive.ObjectID, page int) ([]models.Materials, error)
	GetMaterialByID(ctx context.Context, id primitive.ObjectID) (models.Materials, error)
	CreateMaterial(ctx context.Context, material models.Materials) (models.Materials, error)

	UpdateMaterial(ctx context.Context, material models.Materials) (models.Materials, error)
	DeleteMaterial(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID) error
}

type materialUseCase struct {
	materialRepository repository.MaterialsRepository
}

func (m *materialUseCase) GetMaterials(ctx context.Context, userID primitive.ObjectID, page int) ([]models.Materials, error) {
	return m.materialRepository.GetMaterials(ctx, userID, page)
}
func (m *materialUseCase) GetMaterialByID(ctx context.Context, id primitive.ObjectID) (models.Materials, error) {
	return m.materialRepository.GetMaterialsByID(ctx, id)
}
func (m *materialUseCase) CreateMaterial(ctx context.Context, material models.Materials) (models.Materials, error) {
	return m.materialRepository.CreateMaterials(ctx, material)
}
func (m *materialUseCase) UpdateMaterial(ctx context.Context, material models.Materials) (models.Materials, error) {
	return m.materialRepository.UpdateMaterials(ctx, material)
}
func (m *materialUseCase) DeleteMaterial(ctx context.Context, userID primitive.ObjectID, id primitive.ObjectID) error {
	return m.materialRepository.DeleteMaterials(ctx, userID, id)
}
func NewMaterialUseCase(materialRepository repository.MaterialsRepository) MaterialUseCase {
	return &materialUseCase{
		materialRepository: materialRepository,
	}
}
