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

func (r *CameraRepo) GellAllCamerasByUserID(ctx context.Context, userID uint) ([]models.Camera, error) {
	var cameras []models.Camera
	err := r.db.WithContext(ctx).Where("user_id = ?", userID).Find(&cameras).Error
	if err != nil {
		return nil, err
	}

	return cameras, nil
}
