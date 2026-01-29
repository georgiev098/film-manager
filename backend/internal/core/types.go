package core

import (
	"log"

	"gorm.io/gorm"
)

type Config struct {
	Port int
	Env  string
	Api  string
	Db   struct {
		Dsn string
	}
}

type AppDeps struct {
	DB     *gorm.DB
	Logger *log.Logger
	Config Config
}
