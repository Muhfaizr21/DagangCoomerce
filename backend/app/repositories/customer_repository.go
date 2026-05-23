package repositories

import (
	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
	"gorm.io/gorm"
)

type CustomerRepository interface {
	Create(customer *models.Customer) error
	FindByID(id uint) (*models.Customer, error)
	FindByEmail(email string) (*models.Customer, error)
	Update(customer *models.Customer) error
	Delete(id uint) error
	All() ([]models.Customer, error)
	AllActivities() ([]models.CustomerActivity, error)
	CreateActivity(activity *models.CustomerActivity) error
}

type customerRepository struct {
	db *gorm.DB
}

func NewCustomerRepository(db *gorm.DB) CustomerRepository {
	return &customerRepository{db: db}
}

func (r *customerRepository) Create(customer *models.Customer) error {
	return r.db.Create(customer).Error
}

func (r *customerRepository) FindByID(id uint) (*models.Customer, error) {
	var customer models.Customer
	if err := r.db.First(&customer, id).Error; err != nil {
		return nil, err
	}
	return &customer, nil
}

func (r *customerRepository) FindByEmail(email string) (*models.Customer, error) {
	var customer models.Customer
	if err := r.db.Where("email = ?", email).First(&customer).Error; err != nil {
		return nil, err
	}
	return &customer, nil
}

func (r *customerRepository) Update(customer *models.Customer) error {
	return r.db.Save(customer).Error
}

func (r *customerRepository) Delete(id uint) error {
	return r.db.Delete(&models.Customer{}, id).Error
}

func (r *customerRepository) All() ([]models.Customer, error) {
	var customers []models.Customer
	if err := r.db.Order("id desc").Find(&customers).Error; err != nil {
		return nil, err
	}
	return customers, nil
}

func (r *customerRepository) AllActivities() ([]models.CustomerActivity, error) {
	var activities []models.CustomerActivity
	if err := r.db.Order("id desc").Limit(15).Find(&activities).Error; err != nil {
		return nil, err
	}
	return activities, nil
}

func (r *customerRepository) CreateActivity(activity *models.CustomerActivity) error {
	return r.db.Create(activity).Error
}
