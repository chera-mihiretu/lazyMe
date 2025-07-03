package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DepartmentUseCase interface {
	GetListOfDepartments(ctx context.Context, ids []primitive.ObjectID) ([]models.Departments, error)
}

type departmentUseCase struct {
	departmentRepository repository.DepartmentRepository
}

// GetListOfDepartments implements DepartmentUseCase.
func (d *departmentUseCase) GetListOfDepartments(ctx context.Context, ids []primitive.ObjectID) ([]models.Departments, error) {
	return d.departmentRepository.GetListOfDepartments(ctx, ids)
}

func NewDepartmentUseCase(departmentRepository repository.DepartmentRepository) DepartmentUseCase {
	return &departmentUseCase{
		departmentRepository: departmentRepository,
	}
}
