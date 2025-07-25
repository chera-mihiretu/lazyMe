package main

import (
	"github.com/chera-mihiretu/IKnow/infrastructure/storage"
	"github.com/chera-mihiretu/IKnow/repository"
	"github.com/chera-mihiretu/IKnow/usecases"
)

func StorageInstances(bucketName, folderName string) usecases.StorageUseCase {

	supabaseStorage := storage.NewSupabaseStorage(bucketName, folderName)

	storageRepo := repository.NewStorageRepository(supabaseStorage)

	storageUseCase := usecases.NewStorageUseCase(storageRepo)

	return storageUseCase

}
