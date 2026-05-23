package services

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
	"github.com/muhfaiizr/dagangcommerce/backend/app/repositories"
	"github.com/muhfaiizr/dagangcommerce/backend/config"
)

type UserService interface {
	Register(name, email, password string) (*models.User, error)
	Login(email, password string) (string, *models.User, error)
	GetProfile(id uint) (*models.User, error)
	GetAllUsers() ([]models.User, error)
}

type userService struct {
	repo repositories.UserRepository
	cfg  *config.Config
}

func NewUserService(repo repositories.UserRepository, cfg *config.Config) UserService {
	return &userService{
		repo: repo,
		cfg:  cfg,
	}
}

func (s *userService) Register(name, email, password string) (*models.User, error) {
	// Check if email is already taken
	existing, _ := s.repo.FindByEmail(email)
	if existing != nil {
		return nil, errors.New("email address is already registered")
	}

	user := &models.User{
		Name:     name,
		Email:    email,
		Password: password, // hooks in models/user.go will hash this automatically
	}

	if err := s.repo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *userService) Login(email, password string) (string, *models.User, error) {
	user, err := s.repo.FindByEmail(email)
	if err != nil {
		return "", nil, errors.New("invalid email or password credentials")
	}

	if !user.CheckPassword(password) {
		return "", nil, errors.New("invalid email or password credentials")
	}

	// Create JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * time.Duration(s.cfg.JWT.ExpireHours)).Unix(),
		"iat": time.Now().Unix(),
	})

	tokenString, err := token.SignedString([]byte(s.cfg.JWT.Secret))
	if err != nil {
		return "", nil, err
	}

	return tokenString, user, nil
}

func (s *userService) GetProfile(id uint) (*models.User, error) {
	return s.repo.FindByID(id)
}

func (s *userService) GetAllUsers() ([]models.User, error) {
	return s.repo.All()
}
