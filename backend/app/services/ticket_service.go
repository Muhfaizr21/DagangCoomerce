package services

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
	"github.com/muhfaiizr/dagangcommerce/backend/app/repositories"
)

type TicketService interface {
	CreateTicket(title, description, priority, status, customer, email, avatar string) (*models.Ticket, error)
	GetTicketByID(id uint) (*models.Ticket, error)
	GetTicketByTicketID(ticketID string) (*models.Ticket, error)
	UpdateTicketPriority(ticketID, priority string) (*models.Ticket, error)
	UpdateTicketStatus(ticketID, status string) (*models.Ticket, error)
	GetAllTickets() ([]models.Ticket, error)
	AddTicketMessage(ticketID, sender, senderName, text, avatar string) (*models.TicketMessage, error)
	DeleteTicket(id uint) error
}

type ticketService struct {
	repo repositories.TicketRepository
}

func NewTicketService(repo repositories.TicketRepository) TicketService {
	return &ticketService{repo: repo}
}

func (s *ticketService) CreateTicket(title, description, priority, status, customer, email, avatar string) (*models.Ticket, error) {
	rand.Seed(time.Now().UnixNano())
	ticketID := fmt.Sprintf("TK-%d", rand.Intn(9000)+1000)

	ticket := &models.Ticket{
		TicketID:    ticketID,
		Title:       title,
		Description: description,
		Priority:    priority,
		Status:      status,
		Customer:    customer,
		Email:       email,
		Avatar:      avatar,
	}

	if err := s.repo.Create(ticket); err != nil {
		return nil, err
	}

	// Create initial customer message containing the ticket description
	if description != "" {
		_, _ = s.AddTicketMessage(ticketID, "customer", customer, description, avatar)
	}

	return ticket, nil
}

func (s *ticketService) GetTicketByID(id uint) (*models.Ticket, error) {
	return s.repo.FindByID(id)
}

func (s *ticketService) GetTicketByTicketID(ticketID string) (*models.Ticket, error) {
	return s.repo.FindByTicketID(ticketID)
}

func (s *ticketService) UpdateTicketPriority(ticketID, priority string) (*models.Ticket, error) {
	ticket, err := s.repo.FindByTicketID(ticketID)
	if err != nil {
		return nil, err
	}

	ticket.Priority = priority
	if err := s.repo.Update(ticket); err != nil {
		return nil, err
	}

	return ticket, nil
}

func (s *ticketService) UpdateTicketStatus(ticketID, status string) (*models.Ticket, error) {
	ticket, err := s.repo.FindByTicketID(ticketID)
	if err != nil {
		return nil, err
	}

	ticket.Status = status
	if err := s.repo.Update(ticket); err != nil {
		return nil, err
	}

	return ticket, nil
}

func (s *ticketService) GetAllTickets() ([]models.Ticket, error) {
	return s.repo.All()
}

func (s *ticketService) AddTicketMessage(ticketID, sender, senderName, text, avatar string) (*models.TicketMessage, error) {
	message := &models.TicketMessage{
		TicketID:   ticketID,
		Sender:     sender,
		SenderName: senderName,
		Text:       text,
		Avatar:     avatar,
		CreatedAt:  time.Now(),
	}

	if err := s.repo.CreateMessage(message); err != nil {
		return nil, err
	}

	return message, nil
}

func (s *ticketService) DeleteTicket(id uint) error {
	return s.repo.Delete(id)
}
