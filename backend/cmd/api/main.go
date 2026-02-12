package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/georgiev098/film-manager/backend/internal/app"
	"github.com/georgiev098/film-manager/backend/internal/core"
	"github.com/georgiev098/film-manager/backend/internal/db"
	"github.com/georgiev098/film-manager/backend/internal/models"
	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	cfg := app.LoadConfig()

	infoLog := log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)
	errLog := log.New(os.Stdout, "ERROR\t", log.Ldate|log.Ltime|log.Lshortfile)

	app := &app.Application{
		Config:   cfg,
		InfoLog:  infoLog,
		ErrorLog: errLog,
	}

	// Context with shutdown signal
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// Connext to DB
	database, err := db.Connect(ctx, app.Config.Db.Dsn)
	if err != nil {
		app.ErrorLog.Fatalf("Failed to connect to DB: %v", err)
	}

	app.DB = database

	// ---- MIGRATE SCHEMA ----
	err = app.DB.AutoMigrate(&models.User{}, &models.Camera{}, &models.Lens{}, &models.RefreshToken{})
	if err != nil {
		app.ErrorLog.Fatalf("AutoMigrate failed: %v", err)
	}

	// ---- COMPOSITION ROOT ----
	// Bundle shared dependencies
	deps := &core.AppDeps{
		DB:       app.DB,
		Logger:   app.InfoLog,
		Config:   app.Config,
		Validate: validator.New(),
	}

	err = app.Serve(ctx, deps)
	if err != nil && err != http.ErrServerClosed {
		app.ErrorLog.Fatalf("Server error: %v", err)
	}
}
