package models

import "gorm.io/gorm"

type Lens struct {
	gorm.Model
	FocalLengthMin int     `gorm:"not null" json:"min_focal_length"` // "50" or "70"
	FocalLengthMax int     `gorm:"not null" json:"max_focal_length"` // "50" or "70"
	MinApertureStr string  `gorm:"not null" json:"min_aperture"`     // "f/2.8"
	MaxApertureStr string  `gorm:"not null" json:"max_aperture"`     // "f/4.0"
	Mount          string  `gorm:"not null" json:"mount"`            // "F-mount"
	Notes          *string `json:"notes"`                            // optional
	UserID         uint    `gorm:"not null" json:"user_id"`
	User           User    `gorm:"foreignKey:UserID" json:"-"`
}
