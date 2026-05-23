package models

import (
	"time"

	"gorm.io/gorm"
)

type Ticket struct {
	ID          uint            `gorm:"primaryKey" json:"id"`
	TicketID    string          `gorm:"size:100;uniqueIndex;not null" json:"ticket_id"`
	Title       string          `gorm:"size:255;not null" json:"title"`
	Description string          `gorm:"type:text" json:"description"`
	Priority    string          `gorm:"size:50;not null;default:'Medium'" json:"priority"`
	Status      string          `gorm:"size:50;not null;default:'Open'" json:"status"`
	Customer    string          `gorm:"size:255;not null" json:"customer"`
	Email       string          `gorm:"size:255;not null" json:"email"`
	Avatar      string          `gorm:"size:255" json:"avatar"`
	Messages    []TicketMessage `gorm:"foreignKey:TicketID;references:TicketID" json:"messages"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
	DeletedAt   gorm.DeletedAt  `gorm:"index" json:"deleted_at,omitempty"`
}

type TicketMessage struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	TicketID   string    `gorm:"size:100;not null;index" json:"ticket_id"`
	Sender     string    `gorm:"size:50;not null" json:"sender"` // customer | agent
	SenderName string    `gorm:"size:255;not null" json:"senderName"`
	Text       string    `gorm:"type:text;not null" json:"text"`
	Avatar     string    `gorm:"size:255" json:"avatar"`
	CreatedAt  time.Time `json:"created_at"`
}
