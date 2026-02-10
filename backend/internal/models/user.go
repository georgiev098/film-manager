package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Email        string `gorm:"uniqueIndex;not null" json:"email" validate:"required,email"`
	PasswordHash string `gorm:"not null" json:"-" validate:"required"`
	FirstName    string `json:"first_name" validate:"required,max=50,min=2"`
	LastName     string `json:"last_name" validate:"required,max=50,min=2"`

	Cameras []Camera `gorm:"foreignKey:UserID" json:"-"`
	Lenses  []Lens   `gorm:"foreignKey:UserID" json:"-"`
}
