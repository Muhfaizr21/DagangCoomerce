package seeders

import (
	"errors"
	"log"

	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
	"gorm.io/gorm"
)

// RunSeeders handles populating the database with default dummy or initial parameters
func RunSeeders(db *gorm.DB) {
	log.Println("Starting database seeding...")

	users := []models.User{
		{
			Name:     "Super Administrator",
			Email:    "superadmin@dagangmaker.com",
			Password: "password123", // Hashes automatically via GORM BeforeCreate hook
			Role:     "superadmin",
		},
		{
			Name:     "Administrator",
			Email:    "admin@dagangcommerce.com",
			Password: "password123",
			Role:     "admin",
		},
		{
			Name:     "John Doe",
			Email:    "johndoe@example.com",
			Password: "password123",
			Role:     "user",
		},
	}

	for _, u := range users {
		var existing models.User
		err := db.Where("email = ?", u.Email).First(&existing).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			if err := db.Create(&u).Error; err != nil {
				log.Printf("Warning: failed to seed user %s: %v", u.Email, err)
			} else {
				log.Printf("Seeded user account: %s", u.Email)
			}
		} else if err != nil {
			log.Printf("Error checking existence of user %s: %v", u.Email, err)
		} else {
			log.Printf("User %s already exists, skipping.", u.Email)
		}
	}

	SeedBlogs(db)
	SeedTemplates(db)
	SeedAdminDashboardData(db)

	log.Println("Database seeding successfully executed.")
}
