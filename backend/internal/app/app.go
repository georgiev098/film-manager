package app

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/georgiev098/film-manager/backend/internal/core"
	"github.com/georgiev098/film-manager/backend/internal/routes"
	"gorm.io/gorm"
)

type Application struct {
	Config   core.Config
	InfoLog  *log.Logger
	ErrorLog *log.Logger
	DB       *gorm.DB
}

func (app *Application) Serve(ctx context.Context, deps *core.AppDeps) error {
	// initialize server config
	srv := &http.Server{
		Addr:              fmt.Sprintf(":%d", app.Config.Port),
		Handler:           routes.Register(deps),
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
