package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/georgiev098/film-manager/backend/internal/db"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}
	var cfg Config

	flag.IntVar(&cfg.Port, "port", 8080, "Server port to listen on")
	flag.StringVar(&cfg.Env, "dev", "dev", "Application environment {dev | prod}")
	flag.StringVar(&cfg.Db.Dsn, "dsn", fmt.Sprintf("%s:%s@tcp(%s:3306)/film_manager?parseTime=true&tls=false", os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), dbHost), "DSN")
	flag.StringVar(&cfg.Api, "api", "http://localhost:4000", "URL to Api")

	flag.Parse()
	infoLog := log.New(os.Stdout, "INFO\t", log.Ldate|log.Ltime)
	errLog := log.New(os.Stdout, "ERROR\t", log.Ldate|log.Ltime|log.Lshortfile)

	app := &Application{
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
	err = app.serve(ctx)
	if err != nil && err != http.ErrServerClosed {
		app.ErrorLog.Fatalf("Server error: %v", err)
	}
}

func (app *Application) serve(ctx context.Context) error {
	// initialize server config
	srv := &http.Server{
		Addr:              fmt.Sprintf(":%d", app.Config.Port),
		Handler:           app.routes(),
		IdleTimeout:       30 * time.Second,
		ReadTimeout:       10 * time.Second,
		ReadHeaderTimeout: 5 * time.Second,
		WriteTimeout:      5 * time.Second,
	}

	app.InfoLog.Printf("Starting HTTP server in %s on port %d", app.Config.Env, app.Config.Port)

	go func() {
		err := srv.ListenAndServe()
		if err != nil && err != http.ErrServerClosed {
			app.ErrorLog.Fatalf("ListenAndServe error: %v", err)
		}
	}()

	// Wait for shutdown signal
	<-ctx.Done()
	app.InfoLog.Println("Shutdown signal received")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	return srv.Shutdown(shutdownCtx)
}
