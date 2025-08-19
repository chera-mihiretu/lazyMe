package main

import (
	"context"
	"log"
	"os"

	"github.com/chera-mihiretu/IKnow/delivery/controller"
	"github.com/chera-mihiretu/IKnow/delivery/router"
	"github.com/chera-mihiretu/IKnow/infrastructure/mongodb"
	"github.com/chera-mihiretu/IKnow/infrastructure/my_websocket"
	"github.com/chera-mihiretu/IKnow/infrastructure/redis"
	"github.com/chera-mihiretu/IKnow/repository"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	GothSetup()
	client, err := mongodb.NewMongoClient()

	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	// redis.RateLimiter()

	myDatabase := client.Database("lazyme")
	geminiClient, err := GeminiClient(context.Background())
	if err != nil {
		log.Fatal("Failed to create Gemini client:", err)
	}
	geminiRepository := repository.NewGeminiRepository(geminiClient)

	// posts storage dependencies
	postsStorageUseCase := StorageInstances(os.Getenv("SUPABASE_BUCKET_NAME"), "posts")
	profileStorageUseCase := StorageInstances(os.Getenv("SUPABASE_BUCKET_NAME"), "profile")
	materialsStorageUseCase := StorageInstances(os.Getenv("SUPABASE_BUCKET_NAME"), "materials")

	// user dependencies
	userRepository := repository.NewUserRepository(myDatabase)
	userUseCase := usecases.NewUserUseCase(userRepository)
	userController := controller.NewUserController(userUseCase, profileStorageUseCase)

	// department dependencies
	departmentRepository := repository.NewDepartmentRepository(myDatabase)
	departmentUsecase := usecases.NewDepartmentUseCase(departmentRepository)
	departmentController := controller.NewDepartmentController(departmentUsecase)

	// websocket dependencies
	webSocketClient := my_websocket.NewWebSocketClient()
	webSocketRepository := repository.NewWebSocketRepository(webSocketClient)
	webSocketUsecase := usecases.NewWebSocketUsecase(webSocketRepository)
	webSocketController := controller.NewWebSocketController(webSocketUsecase)

	// notification dependencies
	notificationRepository := repository.NewNotificationRepository(myDatabase)
	notificationUsecase := usecases.NewNotificationUsecase(notificationRepository, webSocketUsecase)
	notificationController := controller.NewNotificationController(notificationUsecase, userUseCase)
	// follow dependencies
	connectionRepository := repository.NewConnectRepository(myDatabase)
	connectionUsecase := usecases.NewConnectUsecase(connectionRepository)
	connectionController := controller.NewConnectController(connectionUsecase, userRepository, notificationUsecase)
	// post dependencies
	postRepository := repository.NewPostRepository(
		myDatabase,
		departmentRepository,
		connectionRepository,
		*userRepository,
		geminiRepository,
	)
	postUseCase := usecases.NewPostUseCase(postRepository)
	// like dependencies
	postLikeRepository := repository.NewPostLikeRepository(myDatabase)
	postLikeUsecase := usecases.NewPostLikeUsecase(postLikeRepository)
	postLikeController := controller.NewPostLikeController(postLikeUsecase, notificationUsecase, postUseCase)

	// dependecy crumble
	PostController := controller.NewPostController(postUseCase, userUseCase, departmentUsecase, postsStorageUseCase, postLikeUsecase, notificationUsecase)

	jobLikeRepository := repository.NewJobLikeRepository(myDatabase)
	jobLikeUsecase := usecases.NewJobLikeUsecase(jobLikeRepository)
	jobLikeController := controller.NewJobLikeController(jobLikeUsecase)
	// comment dependencies
	commentRepository := repository.NewCommentRepository(myDatabase)
	commentUsecase := usecases.NewCommentUsecase(commentRepository)
	commentController := controller.NewCommentController(commentUsecase, userUseCase, postUseCase, notificationUsecase)
	// gemini dependencies

	// material dependencies
	materialRepository := repository.NewMaterialsRepository(myDatabase)
	materialUseCase := usecases.NewMaterialUseCase(materialRepository)
	MaterialController := controller.NewMaterialController(materialUseCase, materialsStorageUseCase)
	// school dependencies
	schoolRepository := repository.NewSchoolRepository(myDatabase)
	schoolUseCase := usecases.NewSchoolUsecase(schoolRepository)
	schoolController := controller.NewSchoolController(schoolUseCase)
	// university dependencies
	universityRepository := repository.NewUniversityRepository(myDatabase)
	universityUseCase := usecases.NewUniversityUsecase(universityRepository)
	universityController := controller.NewUniversityController(universityUseCase)
	// auth dependecies
	authRepository := repository.NewAuthRepository(myDatabase, universityRepository)
	authUseCase := usecases.NewAuthUseCase(authRepository)
	AuthController := controller.NewAuthController(authUseCase)
	// job dependencies
	jobRepository := repository.NewJobRepository(myDatabase, departmentRepository, geminiRepository)
	jobUsecase := usecases.NewJobUsecase(jobRepository)
	jobController := controller.NewJobController(jobUsecase, userUseCase, jobLikeUsecase)
	// report dependencies
	reportRepository := repository.NewReportRepository(myDatabase)
	reportUseCase := usecases.NewReportUseCase(reportRepository)
	reportController := controller.NewReportController(reportUseCase, userUseCase, postUseCase, jobUsecase, notificationUsecase)
	// admin dependencies
	redisClient := redis.RedisClient()
	if redisClient == nil {
		log.Fatal("Failed to connect to Redis")
	}
	log.Println("✅✅✅✅ Connected to Redis successfully")
	defer redisClient.Close()
	adminRepository := repository.NewAdminRepository(
		geminiRepository,
		userRepository,
		redisClient,
	)
	adminUsecase := usecases.NewAdminUseCase(adminRepository)
	adminController := controller.NewAdminController(adminUsecase)

	router := router.SetupRoutes(
		AuthController,
		PostController,
		connectionController,
		departmentController,
		MaterialController,
		schoolController,
		universityController,
		jobController,
		userController,
		postLikeController,
		jobLikeController,
		commentController,
		reportController,
		adminController,
		webSocketController,
		notificationController,
	)

	if err := router.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
