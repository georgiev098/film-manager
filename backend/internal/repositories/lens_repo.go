package repositories

import (
	"context"

	"github.com/georgiev098/film-manager/backend/internal/models"
	"gorm.io/gorm"
)

type LensRepo struct {
	db *gorm.DB
}

// Constructor
func NewLensRepo(db *gorm.DB) *LensRepo {
	return &LensRepo{
		db: db,
	}
}

func (r *LensRepo) GetAllLenses(ctx context.Context) ([]models.Lens, error) {
	var lenses []models.Lens
	err := r.db.WithContext(ctx).Find(&lenses).Error
	if err != nil {
		return nil, err
	}
	return lenses, nil
}

func (r *LensRepo) GetAllByUserID(ctx context.Context, userID uint) ([]models.Lens, error) {
	var lenses []models.Lens

	err := r.db.WithContext(ctx).Where("user_id = ?", userID).Find(&lenses).Error
	if err != nil {
		return nil, err
	}
	return lenses, nil
}

func (r *LensRepo) CreateLens(ctx context.Context, lens *models.Lens) error {
	return r.db.WithContext(ctx).Create(lens).Error
}

func (r *LensRepo) GetLensByID(ctx context.Context, lensID uint) (*models.Lens, error) {
	var lens models.Lens
	err := r.db.WithContext(ctx).First(&lens, lensID).Error
	if err != nil {
		return nil, err
	}

	return &lens, nil
}

func (r *LensRepo) UpdateLens(ctx context.Context, lens *models.Lens, updates map[string]any) error {
	return r.db.WithContext(ctx).Model(lens).Updates(updates).Error
}

func (r *LensRepo) DeleteLens(ctx context.Context, lens *models.Lens) error {
	return r.db.WithContext(ctx).Delete(lens).Error
}

func (r *LensRepo) DeleteAllByUserID(ctx context.Context, userID uint) error {
	return r.db.WithContext(ctx).Where("user_id = ?", userID).Delete(&models.Lens{}).Error
}
