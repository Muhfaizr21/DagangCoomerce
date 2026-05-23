package repositories

import (
	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
	"gorm.io/gorm"
)

type TemplateRepository interface {
	Create(template *models.Template) error
	FindByID(id uint) (*models.Template, error)
	Update(template *models.Template) error
	Delete(id uint) error
	All() ([]models.Template, error)
	AllActive() ([]models.Template, error)
}

type templateRepository struct {
	db *gorm.DB
}

func NewTemplateRepository(db *gorm.DB) TemplateRepository {
	return &templateRepository{db: db}
}

func (r *templateRepository) Create(template *models.Template) error {
	return r.db.Create(template).Error
}

func (r *templateRepository) FindByID(id uint) (*models.Template, error) {
	var t models.Template
	if err := r.db.First(&t, id).Error; err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *templateRepository) Update(template *models.Template) error {
	return r.db.Save(template).Error
}

func (r *templateRepository) Delete(id uint) error {
	return r.db.Delete(&models.Template{}, id).Error
}

func (r *templateRepository) All() ([]models.Template, error) {
	var templates []models.Template
	if err := r.db.Order("id desc").Find(&templates).Error; err != nil {
		return nil, err
	}
	return templates, nil
}

func (r *templateRepository) AllActive() ([]models.Template, error) {
	var templates []models.Template
	if err := r.db.Where("status = ?", "Active").Order("id desc").Find(&templates).Error; err != nil {
		return nil, err
	}
	return templates, nil
}
