package storage

import (
	"mime/multipart"

	"github.com/aws/aws-sdk-go/service/s3"
)

type BlackblazeStorage interface {
	UploadFiles(files []*multipart.FileHeader) ([]string, error)
}

type blackblazeStorage struct {
	s3Client *s3.S3
}

func NewBlackblazeStorage(s3Client *s3.S3) BlackblazeStorage {
	return &blackblazeStorage{
		s3Client: s3Client,
	}
}

func (b *blackblazeStorage) UploadFiles(files []*multipart.FileHeader) ([]string, error) {
	// var wg sync.WaitGroup
	// var mu sync.Mutex
	// var urls []string
	// var uploadErr error

	// bucket := os.Getenv("BUCKET_NAME")

	// for _, fileHeader := range files {
	// 	wg.Add(1)

	// 	go func(fileHeader *multipart.FileHeader) {
	// 		defer wg.Done()

	// 		// Open the file
	// 		file, err := fileHeader.Open()
	// 		if err != nil {
	// 			mu.Lock()
	// 			uploadErr = err
	// 			mu.Unlock()
	// 			return
	// 		}
	// 		defer file.Close()

	// 		// Generate a unique file key (e.g., using timestamp)
	// 		key := fmt.Sprintf("uploads/%d_%s", time.Now().UnixNano(), fileHeader.Filename)

	// 		// Read file content into a buffer
	// 		var buf bytes.Buffer
	// 		_, err = io.Copy(&buf, file)
	// 		if err != nil {
	// 			mu.Lock()
	// 			uploadErr = err
	// 			mu.Unlock()
	// 			return
	// 		}

	// 		// Create a ReadSeeker from the buffer
	// 		body := bytes.NewReader(buf.Bytes())

	// 		// Upload to S3
	// 		_, err = b.s3Client.PutObject(&s3.PutObjectInput{
	// 			Bucket: &bucket,
	// 			Key:    aws.String(key),
	// 			Body:   body,
	// 			ACL:    aws.String("public-read"), // or your preferred ACL
	// 		})
	// 		if err != nil {
	// 			mu.Lock()
	// 			uploadErr = err
	// 			mu.Unlock()
	// 			return
	// 		}

	// 		url := fmt.Sprintf("https://%s.s3.amazonaws.com/%s", bucket, key)
	// 		mu.Lock()
	// 		urls = append(urls, url)
	// 		mu.Unlock()
	// 	}(fileHeader)
	// }

	// wg.Wait()

	// if uploadErr != nil {
	// 	return nil, uploadErr
	// }

	// return urls, nil

	// TODO : Assuming that these functionality worked
	var urls []string
	urls = append(urls,
		"https://img.freepik.com/free-photo/beautiful-chameleon-wild_23-2151731180.jpg",
		"https://img.freepik.com/free-photo/animal-lizard-nature-multi-colored-close-up-generative-ai_188544-9072.jpg",
	)
	return urls, nil
}
