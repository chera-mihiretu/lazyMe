package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DepartmentUseCase interface {
	GetDepartments(ctx context.Context) ([]models.Departments, error)
	GetDepartmentByID(ctx context.Context, id primitive.ObjectID) (models.Departments, error)
	CreateDepartment(ctx context.Context, department models.Departments) (models.Departments, error)
}

type departmentUseCase struct {
	departmentRepository repository.DepartmentRepository
}

// CreateDepartment implements DepartmentUseCase.
func (d *departmentUseCase) CreateDepartment(ctx context.Context, department models.Departments) (models.Departments, error) {
	return d.departmentRepository.CreateDepartment(ctx, department)
}

// GetDepartmentByID implements DepartmentUseCase.
func (d *departmentUseCase) GetDepartmentByID(ctx context.Context, id primitive.ObjectID) (models.Departments, error) {
	return d.departmentRepository.GetDepartmentByID(ctx, id)
}

// GetDepartments implements DepartmentUseCase.
func (d *departmentUseCase) GetDepartments(ctx context.Context) ([]models.Departments, error) {
	return d.departmentRepository.GetDepartments(ctx)
}

func NewDepartmentUseCase(departmentRepository repository.DepartmentRepository) DepartmentUseCase {
	return &departmentUseCase{
		departmentRepository: departmentRepository,
	}
}
