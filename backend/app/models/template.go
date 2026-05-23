package models

import (
	"time"
)

type Template struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"type:varchar(255);not null" json:"name"`
	Category    string    `gorm:"type:varchar(100);not null" json:"category"`
	Version     string    `gorm:"type:varchar(50);default:'v1.0.0';not null" json:"version"`
	Price       float64   `gorm:"type:decimal(10,2);default:0.0;not null" json:"price"`
	Sales       int       `gorm:"type:integer;default:0;not null" json:"sales"`
	Rating      float64   `gorm:"type:decimal(3,1);default:5.0;not null" json:"rating"`
	Status      string    `gorm:"type:varchar(50);default:'Draft';not null" json:"status"` // Active, Draft
	Image       string    `gorm:"type:text" json:"image"` // Thumbnail image
	DemoURL     string    `gorm:"type:text" json:"demoUrl"` // Live preview URL
	Description string    `gorm:"type:text" json:"description"` // maps to description or dataAlt in frontend
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
