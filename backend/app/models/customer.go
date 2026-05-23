package models

import (
	"time"

	"gorm.io/gorm"
)

type Customer struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"size:255;not null" json:"name"`
	Email     string         `gorm:"size:255;uniqueIndex;not null" json:"email"`
	Status    string         `gorm:"size:50;not null;default:'Active'" json:"status"`
	Templates int            `gorm:"default:0" json:"templates"`
	Spend     int64          `gorm:"default:0" json:"spend"`
	Segment   string         `gorm:"size:50;not null;default:'Individual'" json:"segment"`
	Avatar    string         `gorm:"size:255" json:"avatar"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

type CustomerActivity struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	CustomerName string    `gorm:"size:255;not null" json:"name"`
	Action       string    `gorm:"size:255;not null" json:"action"`
	Type         string    `gorm:"size:50;not null" json:"type"` // purchase | revoke | trial
	CreatedAt    time.Time `json:"created_at"`
}
