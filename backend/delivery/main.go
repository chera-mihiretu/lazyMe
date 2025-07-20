package main

import (
	"log"
	"os"

	"github.com/chera-mihiretu/IKnow/delivery/controller"
	"github.com/chera-mihiretu/IKnow/delivery/router"
	"github.com/chera-mihiretu/IKnow/infrastructure/mongodb"
	"github.com/chera-mihiretu/IKnow/infrastructure/storage"
	"github.com/chera-mihiretu/IKnow/repository"
	"github.com/chera-mihiretu/IKnow/usecases"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load(".env")
	if err != nil {
		panic("Error loading .env file")
	}

	GothSetup()
	client, err := mongodb.NewMongoClient()

	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	myDatabase := client.Database("lazyme")
	// storage dependencies
	posts_supabase := storage.NewSupabaseStorage(os.Getenv("SUPABASE_BUCKET_NAME"), "posts")
	storageRepository := repository.NewStorageRepository(posts_supabase)
	storageUseCase := usecases.NewStorageUseCase(storageRepository)

	// auth dependecies
	authRepository := repository.NewAuthRepository(myDatabase)
	authUseCase := usecases.NewAuthUseCase(authRepository)
	AuthController := controller.NewAuthController(authUseCase)
	// user dependencies
	userRepository := repository.NewUserRepository(myDatabase)
	userUseCase := usecases.NewUserUseCase(userRepository)
	userController := controller.NewUserController(userUseCase, storageUseCase)
	// follow dependencies
	connectionRepository := repository.NewConnectRepository(myDatabase)
	connectionUsecase := usecases.NewConnectUsecase(connectionRepository)
	connectionController := controller.NewConnectController(connectionUsecase, userRepository)
	// department dependencies
	departmentRepository := repository.NewDepartmentRepository(myDatabase)
	departmentUsecase := usecases.NewDepartmentUseCase(departmentRepository)
	departmentController := controller.NewDepartmentController(departmentUsecase)
	// like dependencies
	postLikeRepository := repository.NewPostLikeRepository(myDatabase)
	postLikeUsecase := usecases.NewPostLikeUsecase(postLikeRepository)
	postLikeController := controller.NewPostLikeController(postLikeUsecase)

	jobLikeRepository := repository.NewJobLikeRepository(myDatabase)
	jobLikeUsecase := usecases.NewJobLikeUsecase(jobLikeRepository)
	jobLikeController := controller.NewJobLikeController(jobLikeUsecase)
	// comment dependencies
	commentRepository := repository.NewCommentRepository(myDatabase)
	commentUsecase := usecases.NewCommentUsecase(commentRepository)
	commentController := controller.NewCommentController(commentUsecase, userUseCase)

	// post dependencies
	postRepository := repository.NewPostRepository(
		myDatabase,
		departmentRepository,
		connectionRepository,
		*userRepository)
	postUseCase := usecases.NewPostUseCase(postRepository)
	PostController := controller.NewPostController(postUseCase, userUseCase, departmentUsecase, storageUseCase, postLikeUsecase)
	// material dependencies
	materialRepository := repository.NewMaterialsRepository(myDatabase)
	materialUseCase := usecases.NewMaterialUseCase(materialRepository)
	MaterialController := controller.NewMaterialController(materialUseCase, storageUseCase)
	// school dependencies
	schoolRepository := repository.NewSchoolRepository(myDatabase)
	schoolUseCase := usecases.NewSchoolUsecase(schoolRepository)
	schoolController := controller.NewSchoolController(schoolUseCase)
	// university dependencies
	universityRepository := repository.NewUniversityRepository(myDatabase)
	universityUseCase := usecases.NewUniversityUsecase(universityRepository)
	universityController := controller.NewUniversityController(universityUseCase)
	// job dependencies
	jobRepository := repository.NewJobRepository(myDatabase, departmentRepository)
	jobUsecase := usecases.NewJobUsecase(jobRepository)
	jobController := controller.NewJobController(jobUsecase, userUseCase, jobLikeUsecase)
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
	)

	if err := router.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
