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
	RoleAdmin   = "admin"
	RoleStudent = "student"
	RoleTeacher = "teacher"
	RoleAll     = "all"
)

func SetupRoutes(
	authController *controller.AuthController,
	postController *controller.PostController,
	connectionController *controller.ConnectionController,
	departmentController *controller.DepartmentController,
	materialController *controller.MaterialController,
) *gin.Engine {
	fmt.Println("FRONT_BASE_URL:", os.Getenv("FRONT_BASE_URL"))
	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())
	corsConfig := cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 60 * 60,
	}
	r.Use(cors.New(corsConfig))

	// Auth routes
	googleAuth := r.Group("/api/auth/google")
	googleAuth.Use(middleware.GoogleProvider)
	{
		googleAuth.GET("/login", authController.LoginWithGoogle)
		googleAuth.GET("/logout", func(c *gin.Context) {})
		googleAuth.GET("/callback", authController.HandleCallback)
	}

	emailAuth := r.Group("/api/auth/email")
	{
		emailAuth.POST("/register", authController.RegisterWithEmail)
		emailAuth.POST("/login", authController.LoginWithEmail)
		emailAuth.GET("/verify-email", authController.VerifyEmail)
	}

	// Posts routes (all require user auth)
	postsInfo := r.Group("/api/posts")
	postsInfo.Use(middleware.AuthUserMiddleware(RoleAll))
	{
		postsInfo.GET("/", postController.GetPosts)
		postsInfo.GET("/user/", postController.GetPostsByUserID)
		postsInfo.GET("/me", postController.GetMyPosts)
		postsInfo.GET("/post", postController.GetPostByID)
		postsInfo.POST("/", postController.CreatePost)
		postsInfo.PUT("/:id", postController.UpdatePost)
		postsInfo.DELETE("/", postController.DeletePost)
	}

	// Connection routes (all require student auth)
	connection := r.Group("/api/connections")
	connection.Use(middleware.AuthUserMiddleware(RoleStudent))
	{
		connection.GET("/", connectionController.GetConnections)
		connection.GET("/requests/", connectionController.GetConnectRequests)
		connection.POST("/", connectionController.CreateConnection)
		connection.DELETE("/", connectionController.DeleteConnection)
		connection.GET("/is-connected", connectionController.IsConnected)
		connection.GET("/count", connectionController.GetConnectionsCount)
		connection.POST("/accept", connectionController.AcceptConnection)
	}

	// Department routes
	department := r.Group("/api/department")
	{
		department.GET("/", departmentController.GetDepartments)
		department.POST("/create", middleware.AuthUserMiddleware(RoleAdmin), departmentController.CreateDepartment)
	}

	// Material routes
	material := r.Group("/api/materials")
	material.Use(middleware.AuthUserMiddleware(RoleAll))
	{
		material.GET("/", materialController.GetMaterials)
		material.GET("/:id", materialController.GetMaterialByID)
		material.POST("/", middleware.AuthUserMiddleware(RoleAdmin), materialController.CreateMaterial)
		material.PUT("/:id", middleware.AuthUserMiddleware(RoleAdmin), materialController.UpdateMaterial)
		material.DELETE("/:id", middleware.AuthUserMiddleware(RoleAdmin), materialController.DeleteMaterial)
	}

	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Server is running",
		})
	})

	return r
}
