package models

import (
	"time"
)

type Blog struct {
	ID              uint      `gorm:"primaryKey" json:"id"`
	Title           string    `gorm:"type:varchar(255);not null" json:"title"`
	Slug            string    `gorm:"type:varchar(255);uniqueIndex;not null" json:"slug"`
	Category        string    `gorm:"type:varchar(100);not null" json:"category"`
	Status          string    `gorm:"type:varchar(50);not null;default:'Draft'" json:"status"`
	Content         string    `gorm:"type:text;not null" json:"content"`
	MetaDescription string    `gorm:"type:varchar(255)" json:"meta_description"`
	MetaKeywords    string    `gorm:"type:varchar(255)" json:"meta_keywords"`
	Thumbnail       string    `gorm:"type:varchar(255)" json:"thumbnail"`
	Date            string    `gorm:"type:varchar(50)" json:"date"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}
