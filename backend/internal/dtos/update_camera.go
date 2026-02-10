package dtos

import "github.com/georgiev098/film-manager/backend/internal/models"

type CameraUpdate struct {
	Brand        *string              `json:"brand,omitempty" validate:"omitempty,min=1"`
	CameraModel  *string              `json:"camera_model,omitempty" validate:"omitempty,min=1"`
	CameraFormat *models.CameraFormat `json:"camera_format,omitempty" validate:"omitempty,oneof=35mm 120mm"`
	Year         *int                 `json:"year,omitempty" validate:"omitempty,gt=1800,lte=2026"`
	SerialNumber *string              `json:"serial_number,omitempty"`
	Notes        *string              `json:"notes,omitempty" validate:"omitempty,max=500"`
	ImageURL     *string              `json:"image_url,omitempty" validate:"omitempty,url"`
}
