package main

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

type Application struct {
	Config   Config
	InfoLog  *log.Logger
	ErrorLog *log.Logger
	DB       *gorm.DB
}
