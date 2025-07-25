package storage

import (
	"fmt"
	"mime"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/nedpals/supabase-go"
)

type SupabaseStorage interface {
	UploadFile(fileHeader []*multipart.FileHeader) ([]string, error)
	DeleteFile(filePath []string) error
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
		// Open the file
		file, err := fh.Open()
		if err != nil {
			return nil, fmt.Errorf("failed to open file %s: %w", fh.Filename, err)
		}
		defer file.Close()

		// Generate a unique file path
		extension := filepath.Ext(fh.Filename)
		if extension == "" {
			return nil, fmt.Errorf("file %s has no extension", fh.Filename)
		}
		fileName := fmt.Sprintf("%s%s", time.Now().Format("20060102150405"), extension)
		uploadPath := filepath.Join(s.folder, fileName)

		// Determine content type
		contentType := mime.TypeByExtension(extension)
		if contentType == "" {
			contentType = "application/octet-stream" // Fallback for unknown types
		}
		if extension == ".pdf" {
			contentType = "application/pdf" // Explicitly set for PDFs
		}

		// Set upload options
		uploadOptions := &supabase.FileUploadOptions{
			ContentType: contentType,
		}

		// Upload the file to Supabase
		resp := s.client.Storage.From(s.bucket).Upload(uploadPath, file, uploadOptions)
		if resp.Message != "" {
			return nil, fmt.Errorf("failed to upload file: %s", resp.Message)
		}

		// Generate the public URL for the uploaded file
		fileURL := fmt.Sprintf("%s/storage/v1/object/public/%s/%s", os.Getenv("SUPABASE_URL"), s.bucket, uploadPath)
		uploadedPaths = append(uploadedPaths, fileURL)
	}

	return uploadedPaths, nil
}

func (s *supabaseStorage) DeleteFile(filePath []string) error {
	// Remove prefixes starting from the second "/" from the last
	files := []string{}
	for _, path := range filePath {
		contents := strings.Split(path, "/")

		p := strings.Join(contents[len(contents)-2:], "/")

		files = append(files, p)
	}
	// Delete the file from the Supabase bucket
	responce := s.client.Storage.From(s.bucket).Remove(files)

	if responce.Message != "" {
		return fmt.Errorf("failed to delete file: %s", responce.Message)
	}

	return nil
}
