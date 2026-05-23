package services

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
	"github.com/muhfaiizr/dagangcommerce/backend/app/repositories"
)

type ProjectService interface {
	CreateProject(title, client string, progress int) (*models.Project, error)
	GetProjectByID(id uint) (*models.Project, error)
	UpdateProjectProgress(projectID string, progress int) (*models.Project, error)
	GetAllProjects() ([]models.Project, error)
	DeleteProject(id uint) error
}

type projectService struct {
	repo repositories.ProjectRepository
}

func NewProjectService(repo repositories.ProjectRepository) ProjectService {
	return &projectService{repo: repo}
}

func (s *projectService) CreateProject(title, client string, progress int) (*models.Project, error) {
	rand.Seed(time.Now().UnixNano())
	projID := fmt.Sprintf("PROJ-%d", rand.Intn(900)+100)

	project := &models.Project{
		ProjectID: projID,
		Title:     title,
		Client:    client,
		Progress:  progress,
		StagesStr: "Planning,Hardware,Software,Live",
	}

	if err := s.repo.Create(project); err != nil {
		return nil, err
	}

	// Trigger AfterFind hook logic to popular Stages array
	project.Stages = []string{"Planning", "Hardware", "Software", "Live"}

	return project, nil
}

func (s *projectService) GetProjectByID(id uint) (*models.Project, error) {
	return s.repo.FindByID(id)
}

func (s *projectService) UpdateProjectProgress(projectID string, progress int) (*models.Project, error) {
	project, err := s.repo.FindByProjectID(projectID)
	if err != nil {
		return nil, err
	}

	project.Progress = progress
	if err := s.repo.Update(project); err != nil {
		return nil, err
	}

	project.Stages = []string{"Planning", "Hardware", "Software", "Live"}
	return project, nil
}

func (s *projectService) GetAllProjects() ([]models.Project, error) {
	return s.repo.All()
}

func (s *projectService) DeleteProject(id uint) error {
	return s.repo.Delete(id)
}
