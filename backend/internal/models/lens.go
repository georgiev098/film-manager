package models

import "gorm.io/gorm"

type LensType string

const (
	LensAnalog  LensType = "analog"
	LensDigital LensType = "digital"
)

type Lens struct {
	gorm.Model
	Manufacturer string `gorm:"not null" json:"manufacturer"` // Nikon, Canon, Zeiss

	LensType LensType `gorm:"not null" json:"lens_type"` // analog | digital

	ImageStabilization bool `json:"image_stabilization"`

	FocalLengthMin int `gorm:"not null" json:"min_focal_length"` // "50" or "70"
	FocalLengthMax int `gorm:"not null" json:"max_focal_length"` // "50" or "70"

	MinApertureStr string `gorm:"not null" json:"min_aperture"` // "f/2.8"
	MaxApertureStr string `gorm:"not null" json:"max_aperture"` // "f/4.0"

	Mount string `gorm:"not null" json:"mount"` // "F-mount"

	ImageURL *string `json:"image_url"` // optional

	Notes *string `json:"notes"` // optional

	UserID uint `gorm:"not null" json:"user_id"`
	User   User `gorm:"foreignKey:UserID" json:"-"`
}
