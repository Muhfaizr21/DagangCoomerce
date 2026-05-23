package migrations

import (
	"log"

	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
	"gorm.io/gorm"
)

// RunMigrations runs all GORM auto-migrations to keep DB schema aligned with models
func RunMigrations(db *gorm.DB) {
	log.Println("Starting database migrations...")

	err := db.AutoMigrate(
		&models.User{},
		&models.Blog{},
		&models.Template{},
		&models.Customer{},
		&models.CustomerActivity{},
		&models.Order{},
		&models.OrderTimeline{},
		&models.Project{},
		&models.Ticket{},
		&models.TicketMessage{},
		// Add subsequent model structs here to include in auto-migrations
	)

	if err != nil {
		log.Fatalf("Failed to execute database migrations: %v", err)
	}

	log.Println("Database migrations successfully executed.")
}
