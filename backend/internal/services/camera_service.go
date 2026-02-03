package services

import (
	"context"

	"github.com/georgiev098/film-manager/backend/internal/models"
	"github.com/georgiev098/film-manager/backend/internal/repositories"
)

type CameraService struct {
	repo *repositories.CameraRepo
}

func NewCameraService(repo *repositories.CameraRepo) *CameraService {
	return &CameraService{
		repo: repo,
	}
}

func (s *CameraService) CreateNewCamera(ctx context.Context, camera *models.Camera) {
	// business logic if any
}

func (s *CameraService) GetAllCameras(ctx context.Context) ([]models.Camera, error) {
	// business logic if any
	return s.repo.GetAllCameras(ctx)
}
