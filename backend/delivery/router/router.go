package router

import (
	"github.com/chera-mihiretu/IKnow/delivery/controller"
	"github.com/chera-mihiretu/IKnow/infrastructure/middleware"
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
	router := gin.New()
	router.MaxMultipartMemory = 1 << 25
	googleAuth := router.Group("/api/auth/google")
	{
		googleAuth.GET("/login", middleware.GoogleProvider, authController.LoginWithGoogle)
		googleAuth.GET("/logout", middleware.GoogleProvider, func(c *gin.Context) {})

		googleAuth.GET("/callback", authController.HandleCallback)

	}

	emailAuth := router.Group("/api/auth/email")
	{
		emailAuth.POST("/register", authController.RegisterWithEmail)
		emailAuth.POST("/login", authController.LoginWithEmail)
		emailAuth.GET("/verify-email", authController.VerifyEmail)
	}

	postsInfo := router.Group("/api/posts")

	{
		postsInfo.GET("/", middleware.AuthUserMiddleware(RoleAll), postController.GetPosts)
		postsInfo.GET("/user/", middleware.AuthUserMiddleware(RoleAll), postController.GetPostsByUserID)
		postsInfo.GET("/me", middleware.AuthUserMiddleware(RoleAll), postController.GetMyPosts)
		postsInfo.GET("/post", middleware.AuthUserMiddleware(RoleAll), postController.GetPostByID)
		postsInfo.POST("/", middleware.AuthUserMiddleware(RoleAll), postController.CreatePost)
		postsInfo.PUT("/:id", middleware.AuthUserMiddleware(RoleAll), postController.UpdatePost)
		postsInfo.DELETE("/", middleware.AuthUserMiddleware(RoleAll), postController.DeletePost)
	}

	connection := router.Group("/api/connections")
	{
		connection.GET("/", middleware.AuthUserMiddleware(RoleStudent), connectionController.GetConnections)
		connection.GET("/requests/", middleware.AuthUserMiddleware(RoleStudent), connectionController.GetConnectRequests)
		connection.POST("/", middleware.AuthUserMiddleware(RoleStudent), connectionController.CreateConnection)
		connection.DELETE("/", middleware.AuthUserMiddleware(RoleStudent), connectionController.DeleteConnection)
		connection.GET("/is-connected", middleware.AuthUserMiddleware(RoleStudent), connectionController.IsConnected)
		connection.GET("/count", middleware.AuthUserMiddleware(RoleStudent), connectionController.GetConnectionsCount)
		connection.POST("/accept", middleware.AuthUserMiddleware(RoleStudent), connectionController.AcceptConnection)
	}

	department := router.Group("/api/department")

	{
		department.GET("/", departmentController.GetDepartments)
		department.POST("/create", middleware.AuthUserMiddleware(RoleAdmin), departmentController.CreateDepartment)
	}

	material := router.Group("/api/materials")
	{
		material.GET("/", middleware.AuthUserMiddleware(RoleAll), materialController.GetMaterials)
		material.GET("/:id", middleware.AuthUserMiddleware(RoleAll), materialController.GetMaterialByID)
		material.POST("/", middleware.AuthUserMiddleware(RoleAdmin), materialController.CreateMaterial)
		material.PUT("/:id", middleware.AuthUserMiddleware(RoleAdmin), materialController.UpdateMaterial)
		material.DELETE("/:id", middleware.AuthUserMiddleware(RoleAdmin), materialController.DeleteMaterial)
	}

	router.GET("api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Server is running",
		})
	})

	return router
}
