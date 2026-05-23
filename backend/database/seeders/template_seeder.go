package seeders

import (
	"errors"
	"log"

	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
	"gorm.io/gorm"
)

// SeedTemplates populates the database with 5 premium design templates
func SeedTemplates(db *gorm.DB) {
	log.Println("Seeding templates data...")

	templates := []models.Template{
		{
			Name:        "The Gourmet",
			Category:    "Restaurant",
			Version:     "v1.4.0",
			Price:       49000,
			Sales:       214,
			Rating:      4.9,
			Status:      "Active",
			Image:       "https://lh3.googleusercontent.com/aida-public/AB6AXuBSMgjrkP4eKqm_4BrODeI-GJcY7kZ6xB1iPfO80bWXvtz9DMTsRu6pxObWiNqOCFW0CytpDtkDodH4zMXnRhbyzT_e51s21EbxYIrzzXEHKQn1GZXnwUQ4r1wPqZLbLYi2JMbjGjOvgeiX25rFjdMsapV1nkO41cTUT-SWuEpcS9Z2OWSnondYF5u6ZbFAL1BJxh7z_rCi85xF_dzpT2j44gBKZCALryl_6TgLundif7xrXX6hE8TYfOY5KwSFIev52-xRqsAbLb_0",
			DemoURL:     "http://localhost:5174/demos/the-gourmet/index.html",
			Description: "A highly-aesthetic, responsive restaurant template designed for luxury dining. Integrates table reservations, visual menu catalogs, and elegant storytelling elements.",
		},
		{
			Name:        "Style & Glow",
			Category:    "Salon",
			Version:     "v1.2.1",
			Price:       39000,
			Sales:       142,
			Rating:      4.8,
			Status:      "Active",
			Image:       "https://lh3.googleusercontent.com/aida-public/AB6AXuDui5xDLBlLgvzs_EhjB4krNrP2xVR5KmAzlQwsok8P6PMJlbUE1kyq3osPy8JK6R9c9JUBAX56I5dKdF3REnylCNrPLOCC5U1pnS3SYM3LcZWJf11dBu2MOgkmkBllIZxCs1ke9I7rfZAabD2TOS3T5fduly3erG6gUxwIpJ83J9cHZaR10EP52InUKzLKSR8cinVrCACYpnu-VJLgSttDgiaw83f0pzVv55jw6MnukH2z6sawFByg-4G6PkZcxy1F1NLelUPBib3d",
			DemoURL:     "http://localhost:5174/demos/style-glow/index.html",
			Description: "A sophisticated website layout for beauty salons and spa centers. Includes built-in service reservation calendars, treatment galleries, and client review carousels.",
		},
		{
			Name:        "Urbane Apparel",
			Category:    "Online Store",
			Version:     "v2.0.0",
			Price:       69000,
			Sales:       389,
			Rating:      4.7,
			Status:      "Active",
			Image:       "https://lh3.googleusercontent.com/aida-public/AB6AXuDSuI_F2BMoRWzDjldV_PeYz8bZXBFDStgtK2kKDwj3A_Jgsunus_v-I_oOe0hV7l6muiHca97kJ1BThdCRFFVOqjU0IwCRCzg6SNnGrWB5x3BTxDPSyeWRTOr_frrH_nbePI0JiUyILqjmOhzp_-Sawa9EXyj5wEUbWRhfxrZuk-KvMqcnpkdBSVnxOyZRC67DHOaVjwvBadHYOOjUi1rGPAsp1B5Q8X-vKS6ABXINzZDf87J3ifFvVQ1eW-pVnmpryKtdZVosawir",
			DemoURL:     "http://localhost:5174/demos/urbane-apparel/index.html",
			Description: "A modern, high-conversion online boutique template. Optimized for fast loading, multi-product catalogs, seamless cart experience, and high-quality photography showcases.",
		},
		{
			Name:        "Apex Consulting",
			Category:    "Professional Services",
			Version:     "v1.0.5",
			Price:       59000,
			Sales:       98,
			Rating:      4.9,
			Status:      "Active",
			Image:       "https://lh3.googleusercontent.com/aida-public/AB6AXuCAocVhCFAgGuhC7Z3AkvoZEBzFBM_1dY3B8IFfU0-99wvikJrxurteKUOcxJaCK-ulhF4JJLFx3vtdRGndSzr7E4lvJx3oASOq5OWV9TTT7uJLPY9qyaYdHiBsPI7o8CqzpjTKGVMkyWRQ_lweb-H95RAVqsxlemPOOYT1M8jGgTeZNpTT0bKJK6mKMw2H2Nm8ldQhqH_VxKFBv4s-FNB3egSHHowj4GA9MPZ0LYJ9HGXn2r98cT2wWFf7YPG5xvP1LdMZlajOYxFZ",
			DemoURL:     "http://localhost:5174/demos/apex-consulting/index.html",
			Description: "Designed for corporate advisors, agencies, and law firms. Showcases clear value propositions, consultant profiles, client logos, case studies, and consult form callouts.",
		},
		{
			Name:        "Bistro Brew",
			Category:    "Restaurant",
			Version:     "v1.1.0",
			Price:       29000,
			Sales:       104,
			Rating:      4.6,
			Status:      "Active",
			Image:       "https://lh3.googleusercontent.com/aida-public/AB6AXuCBowpkrCuUzAvaKvADk0FKB6KkjIk0x_JvjKxqHiFWAeLdPRG0jY_RJrYoL89QMPD_pD-X1bc0kK7GEKBGV77ycSnmVT7qkZfurU9bYeGUElLQW7QmOIeoXEoc3hFnPGgoxikGi5RADZqDqkRBORkUB8RvbybSq4lKUBMLXItDnF66uoR09zDYOdK8gUPEwR-0YZ8o_JPK1jDQJ1MgQBdXozagYfK0pTSquDFghYwqLr-BJR9tBG2sZiuNdon5oW1jeZhWeHoxk_Rp",
			DemoURL:     "http://localhost:5174/demos/bistro-brew/index.html",
			Description: "A lively, highly visual template suitable for modern cafes, coffee houses, and bakeries. Includes daily specials, integrated contact forms, and map coordinates.",
		},
	}

	for _, t := range templates {
		var existing models.Template
		err := db.Where("name = ?", t.Name).First(&existing).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			if err := db.Create(&t).Error; err != nil {
				log.Printf("Warning: failed to seed template %s: %v", t.Name, err)
			} else {
				log.Printf("Seeded template: %s", t.Name)
			}
		} else if err != nil {
			log.Printf("Error checking existence of template %s: %v", t.Name, err)
		} else {
			log.Printf("Template %s already exists, skipping.", t.Name)
		}
	}
}
