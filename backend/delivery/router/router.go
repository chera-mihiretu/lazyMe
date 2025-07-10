package router

import (
	"fmt"
	"os"

	"github.com/chera-mihiretu/IKnow/delivery/controller"
	"github.com/chera-mihiretu/IKnow/infrastructure/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

const (
	RoleAdmin   = 3
	RoleStudent = 1
	RoleTeacher = 2
	RoleAll     = 0
)

func SetupRoutes(
	authController *controller.AuthController,
	postController *controller.PostController,
	connectionController *controller.ConnectionController,
	departmentController *controller.DepartmentController,
	materialController *controller.MaterialController,
	schoolController *controller.SchoolController,
	universityController *controller.UniversityController,
) *gin.Engine {
	fmt.Println("FRONT_BASE_URL:", os.Getenv("FRONT_BASE_URL"))
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())
	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // Not "*"
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 60 * 60,
	}

	r.Use(cors.New(corsConfig))
	googleAuth := r.Group("/api/auth/google")
	{
		googleAuth.GET("/login", middleware.GoogleProvider, authController.LoginWithGoogle)
		googleAuth.GET("/logout", middleware.GoogleProvider, func(c *gin.Context) {})

		googleAuth.GET("/callback", authController.HandleCallback)

	}

	emailAuth := r.Group("/api/auth/email")
	{
		emailAuth.POST("/register", authController.RegisterWithEmail)
		emailAuth.POST("/login", authController.LoginWithEmail)
		emailAuth.GET("/verify-email", authController.VerifyEmail)
	}

	postsInfo := r.Group("/api/posts")

	{

		postsInfo.Use(middleware.AuthUserMiddleware(RoleAll))
		postsInfo.GET("/", postController.GetPosts)
		postsInfo.GET("/user/", postController.GetPostsByUserID)
		postsInfo.GET("/me", postController.GetMyPosts)
		postsInfo.GET("/post", postController.GetPostByID)
		postsInfo.POST("/", postController.CreatePost)
		postsInfo.PUT("/:id", postController.UpdatePost)
		postsInfo.DELETE("/", postController.DeletePost)
	}

	connection := r.Group("/api/connections")
	{
		connection.GET("/suggestions", middleware.AuthUserMiddleware(RoleStudent), connectionController.GetConnectionSuggestions)
		connection.GET("/", middleware.AuthUserMiddleware(RoleStudent), connectionController.GetConnections)
		connection.GET("/requests/", middleware.AuthUserMiddleware(RoleStudent), connectionController.GetConnectRequests)
		connection.POST("/", middleware.AuthUserMiddleware(RoleStudent), connectionController.CreateConnection)
		connection.DELETE("/", middleware.AuthUserMiddleware(RoleStudent), connectionController.DeleteConnection)
		connection.GET("/is-connected", middleware.AuthUserMiddleware(RoleStudent), connectionController.IsConnected)
		connection.GET("/count", middleware.AuthUserMiddleware(RoleStudent), connectionController.GetConnectionsCount)
		connection.POST("/accept", middleware.AuthUserMiddleware(RoleStudent), connectionController.AcceptConnection)
	}

	// Materials endpoints
	material := r.Group("/api/materials")
	{
		material.GET("/", middleware.AuthUserMiddleware(RoleAll), materialController.GetMaterials)
		material.GET("/tree", middleware.AuthUserMiddleware(RoleAll), materialController.GetMaterialsInTree)
		material.GET("/:id", middleware.AuthUserMiddleware(RoleAll), materialController.GetMaterialByID)
		material.POST("/", middleware.AuthUserMiddleware(RoleAdmin), materialController.CreateMaterial)
		material.PUT("/:id", middleware.AuthUserMiddleware(RoleAdmin), materialController.UpdateMaterial)
		material.DELETE("/:id", middleware.AuthUserMiddleware(RoleAdmin), materialController.DeleteMaterial)
	}

	// Departments endpoints
	department := r.Group("/api/departments")
	{
		department.GET("/", middleware.AuthUserMiddleware(RoleAll), departmentController.GetDepartments)
		department.GET("/tree", middleware.AuthUserMiddleware(RoleAll), departmentController.GetDepartmentsInTree)
		department.GET("/:id", middleware.AuthUserMiddleware(RoleAll), departmentController.GetDepartmentByID)
		department.POST("/", middleware.AuthUserMiddleware(RoleAdmin), departmentController.CreateDepartment)
		department.PUT("/:id", middleware.AuthUserMiddleware(RoleAdmin), departmentController.UpdateDepartment)
		department.DELETE("/:id", middleware.AuthUserMiddleware(RoleAdmin), departmentController.DeleteDepartment)
	}

	// Schools endpoints
	school := r.Group("/api/schools")
	{
		school.GET("/", middleware.AuthUserMiddleware(RoleAll), schoolController.GetSchools)
		school.GET("/:id", middleware.AuthUserMiddleware(RoleAll), schoolController.GetSchoolByID)
		school.POST("/", middleware.AuthUserMiddleware(RoleAdmin), schoolController.CreateSchool)
		school.PUT("/:id", middleware.AuthUserMiddleware(RoleAdmin), schoolController.UpdateSchool)
		school.DELETE("/:id", middleware.AuthUserMiddleware(RoleAdmin), schoolController.DeleteSchool)
	}

	// Universities endpoints
	university := r.Group("/api/universities")
	{
		university.GET("/", middleware.AuthUserMiddleware(RoleAll), universityController.GetUniversities)
		university.GET("/:id", middleware.AuthUserMiddleware(RoleAll), universityController.GetUniversityByID)
		university.POST("/", middleware.AuthUserMiddleware(RoleAdmin), universityController.CreateUniversity)
		university.PUT("/:id", middleware.AuthUserMiddleware(RoleAdmin), universityController.UpdateUniversity)
		university.DELETE("/:id", middleware.AuthUserMiddleware(RoleAdmin), universityController.DeleteUniversity)
	}

	r.GET("api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Server is running",
		})
	})

	return r
}
