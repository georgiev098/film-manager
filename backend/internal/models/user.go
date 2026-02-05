package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Email        string `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string `gorm:"not null" json:"-"`
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`

	Cameras []Camera `gorm:"foreignKey:UserID" json:"-"`
	Lenses  []Lens   `gorm:"foreignKey:UserID" json:"-"`
}
