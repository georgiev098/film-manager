package models

import "gorm.io/gorm"

type CameraFormat string

const (
	Format35mm  CameraFormat = "35mm"
	Format120mm CameraFormat = "120mm"
)

type Camera struct {
	gorm.Model
	Brand        string       `gorm:"not null" json:"brand"`
	CameraModel  string       `gorm:"not null" json:"camera_model"`
	CameraFormat CameraFormat `gorm:"not null" json:"camera_format"`
	Year         *int         `json:"year"`                       //optional
	SerialNumber *string      `json:"serial_number"`              // optional
	Notes        *string      `json:"notes"`                      // optional
	UserID       uint         `gorm:"not null" json:"user_id"`    // associate with a user
	User         User         `gorm:"foreignKey:UserID" json:"-"` // skip full user in JSON
}
