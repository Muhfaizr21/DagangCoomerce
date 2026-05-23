package repositories

import (
	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
	"gorm.io/gorm"
)

type BlogRepository interface {
	Create(blog *models.Blog) error
	FindByID(id uint) (*models.Blog, error)
	FindBySlug(slug string) (*models.Blog, error)
	Update(blog *models.Blog) error
	Delete(id uint) error
	All() ([]models.Blog, error)
	AllPublished() ([]models.Blog, error)
}

type blogRepository struct {
	db *gorm.DB
}

func NewBlogRepository(db *gorm.DB) BlogRepository {
	return &blogRepository{db: db}
}

func (r *blogRepository) Create(blog *models.Blog) error {
	return r.db.Create(blog).Error
}

func (r *blogRepository) FindByID(id uint) (*models.Blog, error) {
	var blog models.Blog
	if err := r.db.First(&blog, id).Error; err != nil {
		return nil, err
	}
	return &blog, nil
}

func (r *blogRepository) FindBySlug(slug string) (*models.Blog, error) {
	var blog models.Blog
	if err := r.db.Where("slug = ?", slug).First(&blog).Error; err != nil {
		return nil, err
	}
	return &blog, nil
}

func (r *blogRepository) Update(blog *models.Blog) error {
	return r.db.Save(blog).Error
}

func (r *blogRepository) Delete(id uint) error {
	return r.db.Delete(&models.Blog{}, id).Error
}

func (r *blogRepository) All() ([]models.Blog, error) {
	var blogs []models.Blog
	if err := r.db.Order("id desc").Find(&blogs).Error; err != nil {
		return nil, err
	}
	return blogs, nil
}

func (r *blogRepository) AllPublished() ([]models.Blog, error) {
	var blogs []models.Blog
	if err := r.db.Where("status = ?", "Published").Order("id desc").Find(&blogs).Error; err != nil {
		return nil, err
	}
	return blogs, nil
}
