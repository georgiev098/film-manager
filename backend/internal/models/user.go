package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Email     string   `json:"email" gorm:"uniqueIndex;not null"`
	Password  string   `json:"-" gorm:"not null"`
	FirstName string   `json:"first_name"`
	LastName  string   `json:"last_name"`
	Cameras   []Camera `gorm:"foreignKey:UserID" json:"cameras,omitempty"` // optional
	Lenses    []Lens   `gorm:"foreignKey:UserID" json:"lenses,omitempty"`  // optional
}
