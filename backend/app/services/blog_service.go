package services

import (
	"errors"
	"time"

	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
	"github.com/muhfaiizr/dagangcommerce/backend/app/repositories"
)

type BlogService interface {
	CreateBlog(title, slug, category, status, content, metaDesc, metaKeys, thumbnail, date string) (*models.Blog, error)
	GetBlogByID(id uint) (*models.Blog, error)
	GetBlogBySlug(slug string) (*models.Blog, error)
	UpdateBlog(id uint, title, slug, category, status, content, metaDesc, metaKeys, thumbnail, date string) (*models.Blog, error)
	DeleteBlog(id uint) error
	GetAllBlogs() ([]models.Blog, error)
	GetPublishedBlogs() ([]models.Blog, error)
}

type blogService struct {
	repo repositories.BlogRepository
}

func NewBlogService(repo repositories.BlogRepository) BlogService {
	return &blogService{repo: repo}
}

func (s *blogService) CreateBlog(title, slug, category, status, content, metaDesc, metaKeys, thumbnail, date string) (*models.Blog, error) {
	// Check if slug is taken
	existing, _ := s.repo.FindBySlug(slug)
	if existing != nil {
		return nil, errors.New("slug is already taken by another post")
	}

	if date == "" {
		date = time.Now().Format("Jan 02, 2006")
	}

	blog := &models.Blog{
		Title:           title,
		Slug:            slug,
		Category:        category,
		Status:          status,
		Content:         content,
		MetaDescription: metaDesc,
		MetaKeywords:    metaKeys,
		Thumbnail:       thumbnail,
		Date:            date,
	}

	if err := s.repo.Create(blog); err != nil {
		return nil, err
	}

	return blog, nil
}

func (s *blogService) GetBlogByID(id uint) (*models.Blog, error) {
	return s.repo.FindByID(id)
}

func (s *blogService) GetBlogBySlug(slug string) (*models.Blog, error) {
	return s.repo.FindBySlug(slug)
}

func (s *blogService) UpdateBlog(id uint, title, slug, category, status, content, metaDesc, metaKeys, thumbnail, date string) (*models.Blog, error) {
	blog, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}

	// If slug is changing, verify it's not taken
	if blog.Slug != slug {
		existing, _ := s.repo.FindBySlug(slug)
		if existing != nil {
			return nil, errors.New("slug is already taken by another post")
		}
	}

	blog.Title = title
	blog.Slug = slug
	blog.Category = category
	blog.Status = status
	blog.Content = content
	blog.MetaDescription = metaDesc
	blog.MetaKeywords = metaKeys
	blog.Thumbnail = thumbnail
	if date != "" {
		blog.Date = date
	}

	if err := s.repo.Update(blog); err != nil {
		return nil, err
	}

	return blog, nil
}

func (s *blogService) DeleteBlog(id uint) error {
	return s.repo.Delete(id)
}

func (s *blogService) GetAllBlogs() ([]models.Blog, error) {
	return s.repo.All()
}

func (s *blogService) GetPublishedBlogs() ([]models.Blog, error) {
	return s.repo.AllPublished()
}
