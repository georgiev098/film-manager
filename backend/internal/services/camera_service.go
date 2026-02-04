package services

import (
	"context"
	"errors"

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

func (s *CameraService) CreateCamera(ctx context.Context, camera *models.Camera) error {
	// business logic if any
	return s.repo.CreateCamera(ctx, camera)
}

func (s *CameraService) GetAllCameras(ctx context.Context) ([]models.Camera, error) {
	// business logic if any
	return s.repo.GetAllCameras(ctx)
}

func (s *CameraService) GetAllForUser(ctx context.Context, userID uint) ([]models.Camera, error) {
	// business logic if any
	return s.repo.GetAllByUserID(ctx, userID)
}

func (s *CameraService) GetCameraByID(ctx context.Context, cameraID uint) (*models.Camera, error) {
	return s.repo.GetCameraByID(ctx, cameraID)
}

func (s *CameraService) UpdateCamera(ctx context.Context, cameraID uint, userID uint, input models.Camera) (*models.Camera, error) {
	camera, err := s.repo.GetCameraByID(ctx, cameraID)
	if err != nil {
		return nil, err
	}

	// ownership check
	if camera.UserID != userID {
		return nil, errors.New("forbidden")
	}
	// Build map for GORM Updates
	updates := map[string]any{}

	if input.Brand != "" {
		updates["brand"] = input.Brand
	}
	if input.CameraModel != "" {
		updates["camera_model"] = input.CameraModel
	}
	if input.CameraFormat != "" {
		updates["camera_format"] = input.CameraFormat
	}
	if input.Year != nil {
		updates["year"] = input.Year
	}
	if input.SerialNumber != nil {
		updates["serial_number"] = input.SerialNumber
	}
	if input.Notes != nil {
		updates["notes"] = input.Notes
	}
	if input.ImageURL != nil {
		updates["image_url"] = input.ImageURL
	}

	if len(updates) == 0 {
		return camera, nil // nothing to update
	}

	err = s.repo.UpdateCamera(ctx, camera, updates)

	if err != nil {
		return nil, err
	}

	return camera, nil
}

func (s *CameraService) DeleteCamera(ctx context.Context, cameraID uint, userID uint) error {
	camera, err := s.repo.GetCameraByID(ctx, cameraID)

	if err != nil {
		return err
	}

	if camera.UserID != userID {
		return errors.New("forbidden")
	}
	return s.repo.DeleteCamera(ctx, camera)

}
