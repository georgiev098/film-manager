package routes

import (
	"net/http"

	"github.com/georgiev098/film-manager/backend/internal/core"
	"github.com/georgiev098/film-manager/backend/internal/handlers"
	"github.com/go-chi/chi/v5"
)

func Register(deps *core.AppDeps) http.Handler {
	r := chi.NewRouter()

	// --- Global middleware (later) ---
	// r.Use(middleware.RequestID)
	// r.Use(middleware.RealIP)
	// r.Use(middleware.Logger)

	// --- Health check ---
	healthHandler := handlers.NewHealthHandler(deps)
	r.Get("/health", healthHandler.Check)

	// --- Movies (example for later) ---
	// movieHandler := handlers.NewMovieHandler(deps)
	// r.Get("/movies", movieHandler.List)

	// --- Not found / method not allowed ---
	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("not found"))
	})

	r.MethodNotAllowed(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte("method not allowed"))
	})

	return r
}
