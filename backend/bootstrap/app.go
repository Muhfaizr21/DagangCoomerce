package bootstrap

import (
	"github.com/gin-gonic/gin"
	"github.com/muhfaiizr/dagangcommerce/backend/app/http/controllers"
	"github.com/muhfaiizr/dagangcommerce/backend/app/http/controllers/admin"
	"github.com/muhfaiizr/dagangcommerce/backend/app/http/controllers/auth"
	"github.com/muhfaiizr/dagangcommerce/backend/app/http/middleware"
	"github.com/muhfaiizr/dagangcommerce/backend/app/providers"
	"github.com/muhfaiizr/dagangcommerce/backend/app/repositories"
	"github.com/muhfaiizr/dagangcommerce/backend/app/services"
	"github.com/muhfaiizr/dagangcommerce/backend/config"
	"github.com/muhfaiizr/dagangcommerce/backend/database/migrations"
	"github.com/muhfaiizr/dagangcommerce/backend/database/seeders"
	"github.com/muhfaiizr/dagangcommerce/backend/routes"
)

type App struct {
	Engine *gin.Engine
	Config *config.Config
}

// Boot initializes all application systems (Laravel-style bootstrapping)
func Boot() *App {
	// 1. Load Configurations
	cfg := config.Load()

	// 2. Set Gin mode based on config
	if cfg.App.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// 3. Connect to Database (using SQLite as local default config)
	db := providers.BootDatabase(cfg)

	// 4. Run Migrations & Seeders
	migrations.RunMigrations(db)
	seeders.RunSeeders(db)

	// 5. Wire Dependency Injections (Laravel-style service container binding)
	userRepo := repositories.NewUserRepository(db)
	userService := services.NewUserService(userRepo, cfg)
	userController := controllers.NewUserController(userService)
	authController := auth.NewAuthController(userService)

	// Blog DI
	blogRepo := repositories.NewBlogRepository(db)
	blogService := services.NewBlogService(blogRepo)
	blogController := controllers.NewBlogController(blogService)

	// Template DI
	templateRepo := repositories.NewTemplateRepository(db)
	templateService := services.NewTemplateService(templateRepo)
	templateController := admin.NewTemplateController(templateService)

	// Customer DI
	customerRepo := repositories.NewCustomerRepository(db)
	customerService := services.NewCustomerService(customerRepo)
	customerController := admin.NewCustomerController(customerService)

	// Order & Project DI
	orderRepo := repositories.NewOrderRepository(db)
	orderService := services.NewOrderService(orderRepo)
	projectRepo := repositories.NewProjectRepository(db)
	projectService := services.NewProjectService(projectRepo)
	orderController := admin.NewOrderController(orderService, projectService)

	// Ticket DI
	ticketRepo := repositories.NewTicketRepository(db)
	ticketService := services.NewTicketService(ticketRepo)
	ticketController := admin.NewTicketController(ticketService)

	// Admin Controllers
	adminAuthCtrl := admin.NewAuthController(userRepo, cfg)
	adminDashCtrl := admin.NewDashboardController(userRepo)

	// 6. Initialize HTTP Server
	r := gin.New()

	// 7. Global Middleware (Logger, Recovery, CORS)
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(middleware.CorsMiddleware())

	// 8. Map application routes
	routes.MapApiRoutes(
		r,
		cfg,
		userController,
		authController,
		adminAuthCtrl,
		adminDashCtrl,
		blogController,
		templateController,
		customerController,
		orderController,
		ticketController,
	)

	return &App{
		Engine: r,
		Config: cfg,
	}
}

// We import routes in routes/api.go, but Go package routes is outside. Let's make sure routes package import is correct.
// In routes/api.go package name is `routes`. So importing "github.com/muhfaiizr/dagangcommerce/backend/routes" is correct.
