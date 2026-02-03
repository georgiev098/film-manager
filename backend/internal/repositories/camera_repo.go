package repositories

import (
	"context"

	"github.com/georgiev098/film-manager/backend/internal/models"
	"gorm.io/gorm"
)

type CameraRepo struct {
	db *gorm.DB
}

// Constructor
func NewCameraRepo(db *gorm.DB) *CameraRepo {
	return &CameraRepo{db: db}
}

func (r *CameraRepo) GetAllCameras(ctx context.Context) ([]models.Camera, error) {
	var cameras []models.Camera
	err := r.db.WithContext(ctx).Find(&cameras).Error
	if err != nil {
		return nil, err
	}

	return cameras, nil
}

func (r *CameraRepo) GetAllByUserID(ctx context.Context, userID uint) ([]models.Camera, error) {
	var cameras []models.Camera
	err := r.db.WithContext(ctx).Where("user_id = ?", userID).Find(&cameras).Error
	if err != nil {
		return nil, err
	}

	return cameras, nil
}

func (r *CameraRepo) CreateCamera(ctx context.Context, camera *models.Camera) error {
	return r.db.WithContext(ctx).Create(camera).Error
}

func (r *CameraRepo) GetCameraByID(ctx context.Context, cameraID uint) (*models.Camera, error) {
	var camera models.Camera

	err := r.db.WithContext(ctx).First(&camera, cameraID).Error
	if err != nil {
		return nil, err
	}

	return &camera, nil
}

func (r *CameraRepo) UpdateCamera(ctx context.Context, camera *models.Camera) error {
	return r.db.WithContext(ctx).Save(camera).Error
}

func (r *CameraRepo) DeleteCameraBy(ctx context.Context, camera *models.Camera) error {
	return r.db.WithContext(ctx).Delete(camera).Error
}
