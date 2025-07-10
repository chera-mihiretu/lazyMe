package usecases

import (
	"context"

	"github.com/chera-mihiretu/IKnow/domain/models"
	"github.com/chera-mihiretu/IKnow/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DepartmentUseCase interface {
	GetDepartments(ctx context.Context, page int) ([]models.Departments, error)
	GetDepartmentByID(ctx context.Context, id primitive.ObjectID) (models.Departments, error)
	CreateDepartment(ctx context.Context, department models.Departments) (models.Departments, error)
	UpdateDepartment(ctx context.Context, department models.Departments) (models.Departments, error)
	DeleteDepartment(ctx context.Context, id primitive.ObjectID) error
	GetDepartmentsInTree(ctx context.Context, schoolID primitive.ObjectID) ([]models.Departments, error)
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
func (d *departmentUseCase) GetDepartments(ctx context.Context, page int) ([]models.Departments, error) {
	return d.departmentRepository.GetDepartments(ctx, page)
}

// GetDepartmentInTree implements DepartmentUseCase.
func (d *departmentUseCase) GetDepartmentsInTree(ctx context.Context, schoolID primitive.ObjectID) ([]models.Departments, error) {
	return d.departmentRepository.GetDepartmentsInTree(ctx, schoolID)
}

// UpdateDepartment implements DepartmentUseCase.
func (d *departmentUseCase) UpdateDepartment(ctx context.Context, department models.Departments) (models.Departments, error) {
	return d.departmentRepository.UpdateDepartment(ctx, department)
}

// DeleteDepartment implements DepartmentUseCase.
func (d *departmentUseCase) DeleteDepartment(ctx context.Context, id primitive.ObjectID) error {
	return d.departmentRepository.DeleteDepartment(ctx, id)
}

func NewDepartmentUseCase(departmentRepository repository.DepartmentRepository) DepartmentUseCase {
	return &departmentUseCase{
		departmentRepository: departmentRepository,
	}
}
