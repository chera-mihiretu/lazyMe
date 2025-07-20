package storage

import (
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/nedpals/supabase-go"
)

type SupabaseStorage interface {
	UploadFile(fileHeader []*multipart.FileHeader) ([]string, error)
}

type supabaseStorage struct {
	client *supabase.Client
	bucket string
	folder string
}

func NewSupabaseStorage(bucket, folder string) SupabaseStorage {
	client := supabase.CreateClient(
		os.Getenv("SUPABASE_URL"),
		os.Getenv("SUPABASE_SERVICE_ROLE_KEY"),
	)

	return &supabaseStorage{
		client: client,
		bucket: bucket,
		folder: folder,
	}
}

func (s *supabaseStorage) UploadFile(fileHeader []*multipart.FileHeader) ([]string, error) {

	var uploadedPaths []string

	for _, fh := range fileHeader {
		file, err := fh.Open()
		if err != nil {
			return nil, fmt.Errorf("failed to open file: %w", err)
		}
		defer file.Close()

		// Generate a unique file path in the bucket (e.g., uploads/filename.jpg)
		extension := filepath.Ext(fh.Filename)
		fileName := time.Now().Format("20060102150405") + extension
		if fileName == "" {
			return nil, fmt.Errorf("file name cannot be empty")
		}
		uploadPath := filepath.Join(s.folder, fileName) // Store in 'uploads' folder

		// Upload the file to the Supabase bucket
		responce := s.client.Storage.From(s.bucket).Upload(uploadPath, file, nil)

		if responce.Message != "" {
			return nil, fmt.Errorf("failed to upload file: %s", responce.Message)
		}

		// Generate the actual URL for the uploaded file
		fileURL := fmt.Sprintf("%s/storage/v1/object/public/%s/%s", os.Getenv("SUPABASE_URL"), s.bucket, uploadPath)
		uploadedPaths = append(uploadedPaths, fileURL)
	}

	// Return the file paths in the bucket
	return uploadedPaths, nil
}
