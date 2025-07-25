package usecases

import (
	"mime/multipart"

	"github.com/chera-mihiretu/IKnow/repository"
)

type StorageUseCase interface {
	UploadFile(file []*multipart.FileHeader) ([]string, error)
	DeleteFile(file []string) error
}

type storageUseCase struct {
	storageRepository repository.StorageRepository
}

func NewStorageUseCase(repository repository.StorageRepository) StorageUseCase {
	return &storageUseCase{
		storageRepository: repository,
	}
}

func (s *storageUseCase) UploadFile(file []*multipart.FileHeader) ([]string, error) {
	return s.storageRepository.UploadFile(file)
}

func (s *storageUseCase) DeleteFile(file []string) error {
	return s.storageRepository.DeleteFile(file)
}
