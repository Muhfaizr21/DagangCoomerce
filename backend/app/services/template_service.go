package services

import (
	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
	"github.com/muhfaiizr/dagangcommerce/backend/app/repositories"
)

type TemplateService interface {
	CreateTemplate(name, category, version string, price float64, status, image, demoUrl, description string) (*models.Template, error)
	GetTemplateByID(id uint) (*models.Template, error)
	UpdateTemplate(id uint, name, category, version string, price float64, status, image, demoUrl, description string) (*models.Template, error)
	DeleteTemplate(id uint) error
	GetAllTemplates() ([]models.Template, error)
	GetActiveTemplates() ([]models.Template, error)
}

type templateService struct {
	repo repositories.TemplateRepository
}

func NewTemplateService(repo repositories.TemplateRepository) TemplateService {
	return &templateService{repo: repo}
}

func (s *templateService) CreateTemplate(name, category, version string, price float64, status, image, demoUrl, description string) (*models.Template, error) {
	if version == "" {
		version = "v1.0.0"
	}
	if status == "" {
		status = "Draft"
	}

	t := &models.Template{
		Name:        name,
		Category:    category,
		Version:     version,
		Price:       price,
		Status:      status,
		Image:       image,
		DemoURL:     demoUrl,
		Description: description,
		Sales:       0,
		Rating:      5.0,
	}

	if err := s.repo.Create(t); err != nil {
		return nil, err
	}

	return t, nil
}

func (s *templateService) GetTemplateByID(id uint) (*models.Template, error) {
	return s.repo.FindByID(id)
}

func (s *templateService) UpdateTemplate(id uint, name, category, version string, price float64, status, image, demoUrl, description string) (*models.Template, error) {
	t, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	t.Name = name
	t.Category = category
	t.Version = version
	t.Price = price
	t.Status = status
	t.Image = image
	t.DemoURL = demoUrl
	t.Description = description

	if err := s.repo.Update(t); err != nil {
		return nil, err
	}

	return t, nil
}

func (s *templateService) DeleteTemplate(id uint) error {
	return s.repo.Delete(id)
}

func (s *templateService) GetAllTemplates() ([]models.Template, error) {
	return s.repo.All()
}

func (s *templateService) GetActiveTemplates() ([]models.Template, error) {
	return s.repo.AllActive()
}
