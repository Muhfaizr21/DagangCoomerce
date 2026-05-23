package services

import (
	"errors"
	"fmt"
	"time"

	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
	"github.com/muhfaiizr/dagangcommerce/backend/app/repositories"
)

type CustomerService interface {
	CreateCustomer(name, email, status string, templates int, spend int64, segment, avatar string) (*models.Customer, error)
	GetCustomerByID(id uint) (*models.Customer, error)
	UpdateCustomer(id uint, name, email, status string, templates int, spend int64, segment, avatar string) (*models.Customer, error)
	DeleteCustomer(id uint) error
	GetAllCustomers() ([]models.Customer, error)
	ToggleDRMAccess(id uint) (*models.Customer, error)
	GetRecentActivities() ([]models.CustomerActivity, error)
}

type customerService struct {
	repo repositories.CustomerRepository
}

func NewCustomerService(repo repositories.CustomerRepository) CustomerService {
	return &customerService{repo: repo}
}

func (s *customerService) CreateCustomer(name, email, status string, templates int, spend int64, segment, avatar string) (*models.Customer, error) {
	existing, _ := s.repo.FindByEmail(email)
	if existing != nil {
		return nil, errors.New("email is already registered")
	}

	customer := &models.Customer{
		Name:      name,
		Email:     email,
		Status:    status,
		Templates: templates,
		Spend:     spend,
		Segment:   segment,
		Avatar:    avatar,
	}

	if err := s.repo.Create(customer); err != nil {
		return nil, err
	}

	// Log activity
	activity := &models.CustomerActivity{
		CustomerName: name,
		Action:       fmt.Sprintf("registered to the platform database as %s.", segment),
		Type:         "trial",
		CreatedAt:    time.Now(),
	}
	_ = s.repo.CreateActivity(activity)

	return customer, nil
}

func (s *customerService) GetCustomerByID(id uint) (*models.Customer, error) {
	return s.repo.FindByID(id)
}

func (s *customerService) UpdateCustomer(id uint, name, email, status string, templates int, spend int64, segment, avatar string) (*models.Customer, error) {
	customer, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	customer.Name = name
	customer.Email = email
	customer.Status = status
	customer.Templates = templates
	customer.Spend = spend
	customer.Segment = segment
	if avatar != "" {
		customer.Avatar = avatar
	}

	if err := s.repo.Update(customer); err != nil {
		return nil, err
	}

	return customer, nil
}

func (s *customerService) DeleteCustomer(id uint) error {
	customer, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	if err := s.repo.Delete(id); err != nil {
		return err
	}

	// Log activity
	activity := &models.CustomerActivity{
		CustomerName: customer.Name,
		Action:       "deleted from the registry database.",
		Type:         "revoke",
		CreatedAt:    time.Now(),
	}
	_ = s.repo.CreateActivity(activity)

	return nil
}

func (s *customerService) GetAllCustomers() ([]models.Customer, error) {
	return s.repo.All()
}

func (s *customerService) ToggleDRMAccess(id uint) (*models.Customer, error) {
	customer, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	nextStatus := "Active"
	actionType := "purchase"
	if customer.Status == "Active" || customer.Status == "Trial" {
		nextStatus = "Revoked"
		actionType = "revoke"
	}

	customer.Status = nextStatus
	if err := s.repo.Update(customer); err != nil {
		return nil, err
	}

	// Log activity
	activity := &models.CustomerActivity{
		CustomerName: customer.Name,
		Action:       fmt.Sprintf("DRM Access status changed to %s.", nextStatus),
		Type:         actionType,
		CreatedAt:    time.Now(),
	}
	_ = s.repo.CreateActivity(activity)

	return customer, nil
}

func (s *customerService) GetRecentActivities() ([]models.CustomerActivity, error) {
	return s.repo.AllActivities()
}
