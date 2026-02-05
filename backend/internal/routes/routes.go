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
	// --- Logging ---
	r.Use(middlewares.Logging)
	// --- Recovery ---
	r.Use(middlewares.Recovery)
	// --- Auth ---
	r.Use(middlewares.Auth)

	// --- Health check ---
	healthHandler := handlers.NewHealthHandler(deps)
	r.Get("/health", healthHandler.Check)

	// --- Auth ---
	userHandler := handlers.NewUserHandler(deps)
	r.Route("/auth", func(r chi.Router) {
		r.Post("/signup", userHandler.SignUp)
		r.Post("/login", userHandler.Login)
	})

	// --- Cameras---
	cameraHandler := handlers.NewCameraHandler(deps)
	r.Route("/cameras", func(r chi.Router) {
		r.Get("/all", cameraHandler.GetAllCameras)
		r.Get("/", cameraHandler.GetAllCamerasForUser)
		r.Post("/", cameraHandler.CreateCamera)
		r.Get("/{id}", cameraHandler.GetCameraByID)
		r.Patch("/{id}", cameraHandler.UpdateCamera)
		r.Delete("/{id}", cameraHandler.DeleteCamera)
	})

	// --- Lenses ---
	lensHandler := handlers.NewLensHandler(deps)
	r.Route("/lenses", func(r chi.Router) {
		r.Get("/all", lensHandler.GetAllLenses)
		r.Get("/", lensHandler.GetAllLensesForUser)
		r.Post("/", lensHandler.CreateLens)
		r.Get("/{id}", lensHandler.GetLensByID)
		r.Patch("/{id}", lensHandler.UpdateLens)
		r.Delete("/{id}", lensHandler.DeleteLens)

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
