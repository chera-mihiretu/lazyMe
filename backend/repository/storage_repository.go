package repository

import (
	"errors"
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

// Helper for error messages
func storageError(msg string) error {
	return errors.New(msg)
}

func (s *storageRepository) UploadFile(file []*multipart.FileHeader) ([]string, error) {
	urls, err := s.BlackblazeStorage.UploadFiles(file)
	if err != nil {
		return nil, storageError("failed to upload files: " + err.Error())
	}
	return urls, nil
}
