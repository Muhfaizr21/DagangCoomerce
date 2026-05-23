package services

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
	"github.com/muhfaiizr/dagangcommerce/backend/app/repositories"
)

type OrderService interface {
	CreateOrder(customer, email, avatar string, amount float64, status, template, paymentMethod string) (*models.Order, error)
	GetOrderByID(id uint) (*models.Order, error)
	GetOrderByOrderID(orderID string) (*models.Order, error)
	UpdateOrderStatus(orderID, status string) (*models.Order, error)
	GetAllOrders() ([]models.Order, error)
	AddTimelineEvent(orderID, title, desc string, done bool) error
}

type orderService struct {
	repo repositories.OrderRepository
}

func NewOrderService(repo repositories.OrderRepository) OrderService {
	return &orderService{repo: repo}
}

func (s *orderService) CreateOrder(customer, email, avatar string, amount float64, status, template, paymentMethod string) (*models.Order, error) {
	// Generate random OrderID e.g. ORD-1024
	rand.Seed(time.Now().UnixNano())
	orderID := fmt.Sprintf("ORD-%d", rand.Intn(9000)+1000)

	order := &models.Order{
		OrderID:       orderID,
		Customer:      customer,
		Email:         email,
		Avatar:        avatar,
		Amount:        amount,
		Status:        status,
		Template:      template,
		PaymentMethod: paymentMethod,
	}

	if err := s.repo.Create(order); err != nil {
		return nil, err
	}

	// Create initial timeline event
	event := &models.OrderTimeline{
		OrderID:   orderID,
		Title:     "Order Created",
		Desc:      "Manual creation by admin",
		Done:      true,
		CreatedAt: time.Now(),
	}
	_ = s.repo.CreateTimelineEvent(event)

	// Second event based on status
	statusTitle := "Awaiting Payment"
	statusDesc := "Awaiting processing"
	isDone := false
	if status == "Paid" {
		statusTitle = "Payment Verified"
		statusDesc = "Marked as Paid by Admin"
		isDone = true
	} else if status == "Failed" {
		statusTitle = "Payment Failed"
		statusDesc = "Marked as Failed by Admin"
		isDone = true
	}

	event2 := &models.OrderTimeline{
		OrderID:   orderID,
		Title:     statusTitle,
		Desc:      statusDesc,
		Done:      isDone,
		CreatedAt: time.Now().Add(time.Second),
	}
	_ = s.repo.CreateTimelineEvent(event2)

	return order, nil
}

func (s *orderService) GetOrderByID(id uint) (*models.Order, error) {
	return s.repo.FindByID(id)
}

func (s *orderService) GetOrderByOrderID(orderID string) (*models.Order, error) {
	return s.repo.FindByOrderID(orderID)
}

func (s *orderService) UpdateOrderStatus(orderID, status string) (*models.Order, error) {
	order, err := s.repo.FindByOrderID(orderID)
	if err != nil {
		return nil, err
	}

	order.Status = status
	if err := s.repo.Update(order); err != nil {
		return nil, err
	}

	// Add timeline event
	_ = s.AddTimelineEvent(orderID, "Status Updated", fmt.Sprintf("Transaction state marked as %s", status), true)

	return order, nil
}

func (s *orderService) GetAllOrders() ([]models.Order, error) {
	return s.repo.All()
}

func (s *orderService) AddTimelineEvent(orderID string, title, desc string, done bool) error {
	event := &models.OrderTimeline{
		OrderID:   orderID,
		Title:     title,
		Desc:      desc,
		Done:      done,
		CreatedAt: time.Now(),
	}
	return s.repo.CreateTimelineEvent(event)
}
