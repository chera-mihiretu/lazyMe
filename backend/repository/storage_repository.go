package repository

import (
	"mime/multipart"

	"github.com/chera-mihiretu/IKnow/infrastructure/storage"
)

type StorageRepository interface {
	UploadFile(file []*multipart.FileHeader) ([]string, error)
}

type storageRepository struct {
	BlackblazeStorage storage.BlackblazeStorage
}

func NewStorageRepository(blackblazeStorage storage.BlackblazeStorage) StorageRepository {
	return &storageRepository{
		BlackblazeStorage: blackblazeStorage,
	}
}

func (s *storageRepository) UploadFile(file []*multipart.FileHeader) ([]string, error) {
	return s.BlackblazeStorage.UploadFiles(file)
}
