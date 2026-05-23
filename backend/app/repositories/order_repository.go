package repositories

import (
	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
	"gorm.io/gorm"
)

type OrderRepository interface {
	Create(order *models.Order) error
	FindByID(id uint) (*models.Order, error)
	FindByOrderID(orderID string) (*models.Order, error)
	Update(order *models.Order) error
	All() ([]models.Order, error)
	CreateTimelineEvent(event *models.OrderTimeline) error
	Delete(id uint) error
}

type orderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) OrderRepository {
	return &orderRepository{db: db}
}

func (r *orderRepository) Create(order *models.Order) error {
	return r.db.Create(order).Error
}

func (r *orderRepository) FindByID(id uint) (*models.Order, error) {
	var order models.Order
	if err := r.db.Preload("Timeline").First(&order, id).Error; err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *orderRepository) FindByOrderID(orderID string) (*models.Order, error) {
	var order models.Order
	if err := r.db.Preload("Timeline").Where("order_id = ?", orderID).First(&order).Error; err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *orderRepository) Update(order *models.Order) error {
	return r.db.Save(order).Error
}

func (r *orderRepository) All() ([]models.Order, error) {
	var orders []models.Order
	if err := r.db.Preload("Timeline").Order("id desc").Find(&orders).Error; err != nil {
		return nil, err
	}
	return orders, nil
}

func (r *orderRepository) CreateTimelineEvent(event *models.OrderTimeline) error {
	return r.db.Create(event).Error
}

func (r *orderRepository) Delete(id uint) error {
	return r.db.Delete(&models.Order{}, id).Error
}
