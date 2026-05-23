package providers

import (
	"fmt"
	"log"

	"github.com/muhfaiizr/dagangcommerce/backend/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// BootDatabase connects to the database based on environment configs
func BootDatabase(cfg *config.Config) *gorm.DB {
	var db *gorm.DB
	var err error

	switch cfg.DB.Connection {
	case "postgres":
		dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=Asia/Jakarta",
			cfg.DB.Host,
			cfg.DB.Username,
			cfg.DB.Password,
			cfg.DB.Database,
			cfg.DB.Port,
			cfg.DB.SSLMode,
		)

		db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatalf("Failed to connect to PostgreSQL database: %v", err)
		}
		log.Printf("Database connection established: PostgreSQL (%s)", cfg.DB.Database)

	default:
		log.Fatalf("Database connection driver '%s' is not supported", cfg.DB.Connection)
	}

	DB = db
	return DB
}
