package repositories

import (
	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
	"gorm.io/gorm"
)

type TicketRepository interface {
	Create(ticket *models.Ticket) error
	FindByID(id uint) (*models.Ticket, error)
	FindByTicketID(ticketID string) (*models.Ticket, error)
	Update(ticket *models.Ticket) error
	All() ([]models.Ticket, error)
	CreateMessage(message *models.TicketMessage) error
	Delete(id uint) error
}

type ticketRepository struct {
	db *gorm.DB
}

func NewTicketRepository(db *gorm.DB) TicketRepository {
	return &ticketRepository{db: db}
}

func (r *ticketRepository) Create(ticket *models.Ticket) error {
	return r.db.Create(ticket).Error
}

func (r *ticketRepository) FindByID(id uint) (*models.Ticket, error) {
	var ticket models.Ticket
	if err := r.db.Preload("Messages").First(&ticket, id).Error; err != nil {
		return nil, err
	}
	return &ticket, nil
}

func (r *ticketRepository) FindByTicketID(ticketID string) (*models.Ticket, error) {
	var ticket models.Ticket
	if err := r.db.Preload("Messages").Where("ticket_id = ?", ticketID).First(&ticket).Error; err != nil {
		return nil, err
	}
	return &ticket, nil
}

func (r *ticketRepository) Update(ticket *models.Ticket) error {
	return r.db.Save(ticket).Error
}

func (r *ticketRepository) All() ([]models.Ticket, error) {
	var tickets []models.Ticket
	if err := r.db.Preload("Messages").Order("id desc").Find(&tickets).Error; err != nil {
		return nil, err
	}
	return tickets, nil
}

func (r *ticketRepository) CreateMessage(message *models.TicketMessage) error {
	return r.db.Create(message).Error
}

func (r *ticketRepository) Delete(id uint) error {
	return r.db.Delete(&models.Ticket{}, id).Error
}
