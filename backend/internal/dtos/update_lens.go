package dtos

import "github.com/georgiev098/film-manager/backend/internal/models"

type LensUpdate struct {
	Manufacturer       *string          `json:"manufacturer,omitempty" validate:"omitempty,min=2"`
	LensType           *models.LensType `json:"lens_type,omitempty" validate:"omitempty,oneof=analog digital"`
	ImageStabilization *bool            `json:"image_stabilization,omitempty"`

	FocalLengthMin *int    `json:"min_focal_length,omitempty" validate:"omitempty,gt=0"`
	FocalLengthMax *int    `json:"max_focal_length,omitempty" validate:"omitempty,gt=0" `
	MinApertureStr *string `json:"min_aperture,omitempty" validate:"omitempty,contains=f/"`
	MaxApertureStr *string `json:"max_aperture,omitempty" validate:"omitempty,contains=f/"`
	Mount          *string `json:"mount,omitempty"`
	ImageURL       *string `json:"image_url,omitempty" validate:"omitempty,url"`
	Notes          *string `json:"notes,omitempty" validate:"omitempty,max=500"`
}
