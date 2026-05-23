package models

import (
	"time"

	"gorm.io/gorm"
)

type Order struct {
	ID            uint            `gorm:"primaryKey" json:"id"`
	OrderID       string          `gorm:"size:100;uniqueIndex;not null" json:"order_id"`
	Customer      string          `gorm:"size:255;not null" json:"customer"`
	Email         string          `gorm:"size:255;not null" json:"email"`
	Avatar        string          `gorm:"size:50" json:"avatar"`
	Amount        float64         `gorm:"not null" json:"amount"`
	Status        string          `gorm:"size:50;not null;default:'Pending'" json:"status"`
	Template      string          `gorm:"size:255;not null" json:"template"`
	PaymentMethod string          `gorm:"size:100" json:"paymentMethod"`
	Timeline      []OrderTimeline `gorm:"foreignKey:OrderID;references:OrderID" json:"timeline"`
	CreatedAt     time.Time       `json:"created_at"`
	UpdatedAt     time.Time       `json:"updated_at"`
	DeletedAt     gorm.DeletedAt  `gorm:"index" json:"deleted_at,omitempty"`
}

type OrderTimeline struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	OrderID   string    `gorm:"size:100;not null;index" json:"order_id"`
	Title     string    `gorm:"size:255;not null" json:"title"`
	Desc      string    `gorm:"type:text" json:"desc"`
	Done      bool      `gorm:"default:false" json:"done"`
	CreatedAt time.Time `json:"created_at"`
}
