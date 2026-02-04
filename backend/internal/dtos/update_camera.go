package dtos

import "github.com/georgiev098/film-manager/backend/internal/models"

type CameraUpdate struct {
	Brand        *string              `json:"brand,omitempty"`
	CameraModel  *string              `json:"camera_model,omitempty"`
	CameraFormat *models.CameraFormat `json:"camera_format,omitempty"`
	Year         *int                 `json:"year,omitempty"`
	SerialNumber *string              `json:"serial_number,omitempty"`
	Notes        *string              `json:"notes,omitempty"`
	ImageURL     *string              `json:"image_url,omitempty"`
}
