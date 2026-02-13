package services

import (
	"context"
	"errors"

	"github.com/georgiev098/film-manager/backend/internal/dtos"
	"github.com/georgiev098/film-manager/backend/internal/models"
	"github.com/georgiev098/film-manager/backend/internal/repositories"
	"gorm.io/gorm"
)

type LensService struct {
	repo *repositories.LensRepo
}

func NewLensService(repo *repositories.LensRepo) *LensService {
	return &LensService{
		repo: repo,
	}
}

func (s *LensService) GetAllLenses(ctx context.Context) ([]models.Lens, error) {
	return s.repo.GetAllLenses(ctx)
}

func (s *LensService) GetAllForUser(ctx context.Context, userID uint) ([]models.Lens, error) {
	return s.repo.GetAllByUserID(ctx, userID)
}

func (s *LensService) GetLensByID(ctx context.Context, lensID uint, userID uint) (*models.Lens, error) {
	lens, err := s.repo.GetLensByID(ctx, lensID)
	if err != nil {
		return nil, err
	}

	if lens.UserID != userID {
		return nil, gorm.ErrRecordNotFound
	}

	return lens, nil
}

func (s *LensService) CreateLens(ctx context.Context, lens *models.Lens) error {
	// business logic, if any
	return s.repo.CreateLens(ctx, lens)
}

func (s *LensService) DeleteLens(ctx context.Context, lensID uint, userID uint) error {
	lens, err := s.repo.GetLensByID(ctx, lensID)

	if err != nil {
		return err
	}

	if lens.UserID != userID {
		return errors.New("forbidden")
	}

	return s.repo.DeleteLens(ctx, lens)
}

func (s *LensService) UpdateLens(ctx context.Context, lensID uint, userID uint, input dtos.LensUpdate) (*models.Lens, error) {
	lens, err := s.repo.GetLensByID(ctx, lensID)
	if err != nil {
		return nil, err
	}

	if lens.UserID != userID {
		return nil, errors.New("forbidden")
	}

	updates := map[string]any{}

	if input.FocalLengthMax != nil {
		updates["max_focal_length"] = input.FocalLengthMax
	}
	if input.FocalLengthMin != nil {
		updates["min_focal_length"] = input.FocalLengthMin
	}
	if input.ImageURL != nil {
		updates["image_url"] = input.ImageURL
	}
	if input.MaxApertureStr != nil {
		updates["max_aperture"] = input.MaxApertureStr
	}
	if input.MinApertureStr != nil {
		updates["min_aperture"] = input.MinApertureStr
	}
	if input.Mount != nil {
		updates["mount"] = input.Mount
	}
	if input.Notes != nil {
		updates["notes"] = input.Notes
	}
	if input.Manufacturer != nil {
		updates["manufacturer"] = *input.Manufacturer
	}
	if input.LensType != nil {
		updates["lens_type"] = *input.LensType
	}
	if input.ImageStabilization != nil {
		updates["image_stabilization"] = *input.ImageStabilization
	}

	if len(updates) == 0 {
		return lens, nil // nothing to update
	}

	err = s.repo.UpdateLens(ctx, lens, updates)
	if err != nil {
		return nil, err
	}

	return lens, nil
}

func (s *LensService) DeleteAllByUser(ctx context.Context, requestingUserID, targetUserID uint) error {
	if requestingUserID != targetUserID {
		return errors.New("forbidden")
	}
	return s.repo.DeleteAllByUserID(ctx, targetUserID)
}
