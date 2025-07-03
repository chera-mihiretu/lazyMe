package storage

import (
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

func TestS3Client() (*s3.S3, error) {
	key_id := os.Getenv("BLACKBLAZE_KEY_ID")
	app_key := os.Getenv("BACKBLAZE_APP_KEY")
	fmt.Println("Key ID:", key_id, "App Key:", app_key)
	s3Config := &aws.Config{
		Credentials:      credentials.NewStaticCredentials(key_id, app_key, ""),
		Endpoint:         aws.String("s3.eu-central-003.backblazeb2.com"),
		Region:           aws.String("eu-central-003"),
		S3ForcePathStyle: aws.Bool(true),
	}

	newSession := session.New(s3Config)
	s3Client := s3.New(newSession)

	// List buckets to test authentication
	result, err := s3Client.ListBuckets(&s3.ListBucketsInput{})
	if err != nil {
		if aerr, ok := err.(awserr.Error); ok {
			fmt.Printf("Error code: %s, Message: %s\n", aerr.Code(), aerr.Message())
		} else {
			fmt.Printf("Error: %v\n", err)
		}
		return nil, err
	}

	for _, bucket := range result.Buckets {
		fmt.Printf("Bucket: %s\n", *bucket.Name)
	}

	return s3Client, nil
}
