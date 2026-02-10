package core

import (
	"log"

	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

type Config struct {
	Port           int
	Env            string
	Api            string
	AllowedOrigins []string
	Db             struct {
		Dsn string
	}
}

type AppDeps struct {
	DB       *gorm.DB
	Logger   *log.Logger
	Config   Config
	Validate *validator.Validate
}
