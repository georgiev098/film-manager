package routes

import (
	"net/http"

	"github.com/georgiev098/film-manager/backend/internal/core"
	"github.com/georgiev098/film-manager/backend/internal/handlers"
	"github.com/georgiev098/film-manager/backend/internal/middlewares"
	"github.com/go-chi/chi/v5"
)

func Register(deps *core.AppDeps) http.Handler {
	r := chi.NewRouter()

	// --- CORS ---
	r.Use(middlewares.CORS(deps))

	// --- Health check ---
	healthHandler := handlers.NewHealthHandler(deps)
	r.Get("/health", healthHandler.Check)

	// --- Movies---
	cameraHandler := handlers.NewCameraHandler(deps)
	r.Route("/cameras", func(r chi.Router) {
		r.Get("/", cameraHandler.GetAllCameras)
	})

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
