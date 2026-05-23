package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/muhfaiizr/dagangcommerce/backend/app/http/controllers"
	"github.com/muhfaiizr/dagangcommerce/backend/app/http/controllers/admin"
	"github.com/muhfaiizr/dagangcommerce/backend/app/http/controllers/auth"
	"github.com/muhfaiizr/dagangcommerce/backend/app/http/middleware"
	"github.com/muhfaiizr/dagangcommerce/backend/config"
)

// MapApiRoutes sets up the routing table for the application
func MapApiRoutes(
	r *gin.Engine,
	cfg *config.Config,
	userController *controllers.UserController,
	authController *auth.AuthController,
	adminAuthCtrl *admin.AuthController,
	adminDashCtrl *admin.DashboardController,
	blogController *controllers.BlogController,
	templateController *admin.TemplateController,
	customerController *admin.CustomerController,
	orderController *admin.OrderController,
	ticketController *admin.TicketController,
) {
	// Root API check
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"app":     cfg.App.Name,
			"version": "1.0.0",
			"status":  "healthy",
		})
	})

	// Mount local uploads directory for static previews
	r.Static("/uploads", "./uploads")

	// API version group (similar to Laravel Route::prefix('api')->group(...))
	api := r.Group("/api")
	{
		// Public Blog Routes
		api.GET("/blogs", blogController.Index)
		api.GET("/blogs/:slug", blogController.Show)

		// Public Template Routes
		api.GET("/templates", templateController.Index)
		api.GET("/templates/:id", templateController.Show)

		// Public Support Tickets (Contact Form)
		api.POST("/tickets", ticketController.CreatePublic)

		// Admin Routes
		adminGroup := api.Group("/admin")
		{
			adminGroup.POST("/login", adminAuthCtrl.Login)

			// Protected Admin Routes
			protectedAdmin := adminGroup.Group("/")
			protectedAdmin.Use(middleware.AuthMiddleware(cfg))
			{
				protectedAdmin.GET("/dashboard", adminDashCtrl.GetStats)

				// Admin CMS Blogs
				protectedAdmin.GET("/blogs", blogController.AdminIndex)
				protectedAdmin.POST("/blogs", blogController.AdminStore)
				protectedAdmin.PUT("/blogs/:id", blogController.AdminUpdate)
				protectedAdmin.DELETE("/blogs/:id", blogController.AdminDelete)

				// Admin CMS Templates
				protectedAdmin.GET("/templates", templateController.AdminIndex)
				protectedAdmin.POST("/templates", templateController.AdminStore)
				protectedAdmin.PUT("/templates/:id", templateController.AdminUpdate)
				protectedAdmin.DELETE("/templates/:id", templateController.AdminDelete)
				protectedAdmin.POST("/templates/upload", templateController.UploadTemplateFiles)

				// Customers Admin Routes
				protectedAdmin.GET("/customers", customerController.Index)
				protectedAdmin.POST("/customers", customerController.Create)
				protectedAdmin.PUT("/customers/:id", customerController.Update)
				protectedAdmin.DELETE("/customers/:id", customerController.Delete)
				protectedAdmin.POST("/customers/:id/toggle-drm", customerController.ToggleDRMAccess)
				protectedAdmin.GET("/customers/activities", customerController.RecentActivities)

				// Orders & Custom Projects Admin Routes
				protectedAdmin.GET("/orders", orderController.Index)
				protectedAdmin.POST("/orders", orderController.Create)
				protectedAdmin.PUT("/orders/:order_id/status", orderController.UpdateStatus)
				protectedAdmin.GET("/projects", orderController.IndexProjects)
				protectedAdmin.POST("/projects", orderController.CreateProject)
				protectedAdmin.PUT("/projects/:project_id/progress", orderController.UpdateProjectProgress)
				protectedAdmin.DELETE("/projects/:id", orderController.DeleteProject)

				// Support Helpdesk Admin Routes
				protectedAdmin.GET("/tickets", ticketController.Index)
				protectedAdmin.GET("/tickets/:ticket_id", ticketController.Show)
				protectedAdmin.POST("/tickets", ticketController.Create)
				protectedAdmin.PUT("/tickets/:ticket_id/priority", ticketController.UpdatePriority)
				protectedAdmin.PUT("/tickets/:ticket_id/status", ticketController.UpdateStatus)
				protectedAdmin.POST("/tickets/:ticket_id/messages", ticketController.AddMessage)
				protectedAdmin.DELETE("/tickets/:id", ticketController.Delete)
			}
		}

		// Public routes (Auth)
		authGroup := api.Group("/auth")
		{
			authGroup.POST("/register", authController.Register)
			authGroup.POST("/login", authController.Login)
		}

		// Private routes gated by AuthMiddleware (similar to Route::middleware('auth:api')->group(...))
		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware(cfg))
		{
			protected.GET("/profile", userController.Profile)
			protected.GET("/users", userController.Index) // Admin/Listing route

		}
	}
}
