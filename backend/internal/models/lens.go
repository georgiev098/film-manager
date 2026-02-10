package models

import "gorm.io/gorm"

type LensType string

const (
	LensAnalog  LensType = "analog"
	LensDigital LensType = "digital"
)

type Lens struct {
	gorm.Model
	Manufacturer string `gorm:"not null" json:"manufacturer" validate:"required,min=2"` // Nikon, Canon, Zeiss

	LensType LensType `gorm:"not null" json:"lens_type" validate:"required,oneof=analog digital"` // analog | digital

	ImageStabilization bool `json:"image_stabilization"`

	FocalLengthMin int `gorm:"not null" json:"min_focal_length" validate:"required,gt=0"`                    // "50" or "70"
	FocalLengthMax int `gorm:"not null" json:"max_focal_length" validate:"required,gtefield=FocalLengthMin"` // "50" or "70"

	MinApertureStr string `gorm:"not null" json:"min_aperture" validate:"required,contains=f/"` // "f/2.8"
	MaxApertureStr string `gorm:"not null" json:"max_aperture" validate:"required,contains=f/"` // "f/4.0"

	Mount string `gorm:"not null" json:"mount" validate:"required"` // "F-mount"

	ImageURL *string `json:"image_url" validate:"omitempty,url"` // optional

	Notes *string `json:"notes" validate:"omitempty,max=500"` // optional

	UserID uint `gorm:"not null" json:"user_id" validate:"required"`
	User   User `gorm:"foreignKey:UserID" json:"-" validate:"-"`
}
