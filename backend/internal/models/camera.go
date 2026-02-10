package models

import "gorm.io/gorm"

type CameraFormat string

const (
	Format35mm  CameraFormat = "35mm"
	Format120mm CameraFormat = "120mm"
)

type Camera struct {
	gorm.Model
	Brand        string       `gorm:"not null" json:"brand" validate:"required"`
	CameraModel  string       `gorm:"not null" json:"camera_model" validate:"required"`
	CameraFormat CameraFormat `gorm:"not null" json:"camera_format" validate:"required,oneof=35mm 120mm"`
	Year         *int         `json:"year" validate:"omitempty,gt=1800,lte=2026"`  //optional
	SerialNumber *string      `json:"serial_number" validate:"omitempty,alphanum"` // optional
	Notes        *string      `json:"notes" validate:"omitempty,max=500"`          // optional
	ImageURL     *string      `json:"image_url" validate:"omitempty,url"`          // optional
	UserID       uint         `gorm:"not null" json:"user_id" validate:"required"` // associate with a user
	User         User         `gorm:"foreignKey:UserID" json:"-" validate:"-"`     // skip full user in JSON
}
