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
	r := gin.Default()
	r.Use(
		cors.New(cors.Config{
			AllowOrigins:     []string{"*"}, // Allow all origins
			AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
			MaxAge:           12 * 60 * 60, // 12 hours
		}),
	)
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
		connection.GET("/", middleware.AuthUserMiddleware(RoleStudent), connectionController.GetConnections)
		connection.GET("/requests/", middleware.AuthUserMiddleware(RoleStudent), connectionController.GetConnectRequests)
		connection.POST("/", middleware.AuthUserMiddleware(RoleStudent), connectionController.CreateConnection)
		connection.DELETE("/", middleware.AuthUserMiddleware(RoleStudent), connectionController.DeleteConnection)
		connection.GET("/is-connected", middleware.AuthUserMiddleware(RoleStudent), connectionController.IsConnected)
		connection.GET("/count", middleware.AuthUserMiddleware(RoleStudent), connectionController.GetConnectionsCount)
		connection.POST("/accept", middleware.AuthUserMiddleware(RoleStudent), connectionController.AcceptConnection)
	}

	department := r.Group("/api/department")

	{
		department.GET("/", departmentController.GetDepartments)
		department.POST("/create", middleware.AuthUserMiddleware(RoleAdmin), departmentController.CreateDepartment)
	}

	material := r.Group("/api/materials")
	{
		material.GET("/", middleware.AuthUserMiddleware(RoleAll), materialController.GetMaterials)
		material.GET("/:id", middleware.AuthUserMiddleware(RoleAll), materialController.GetMaterialByID)
		material.POST("/", middleware.AuthUserMiddleware(RoleAdmin), materialController.CreateMaterial)
		material.PUT("/:id", middleware.AuthUserMiddleware(RoleAdmin), materialController.UpdateMaterial)
		material.DELETE("/:id", middleware.AuthUserMiddleware(RoleAdmin), materialController.DeleteMaterial)
	}

	r.GET("api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Server is running",
		})
	})

	return r
}
