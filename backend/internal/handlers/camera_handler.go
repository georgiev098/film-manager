package handlers

import (
	"net/http"

	"github.com/georgiev098/film-manager/backend/internal/core"
	"github.com/georgiev098/film-manager/backend/internal/helpers"
	"github.com/georgiev098/film-manager/backend/internal/repositories"
	"github.com/georgiev098/film-manager/backend/internal/services"
)

type CameraHandler struct {
	deps    *core.AppDeps
	service *services.CameraService
}

func NewCameraHandler(deps *core.AppDeps) *CameraHandler {
	repo := repositories.NewCameraRepo(deps.DB)
	service := services.NewCameraService(repo)

	return &CameraHandler{
		deps:    deps,
		service: service,
	}
}

func (h *CameraHandler) GetAllCameras(w http.ResponseWriter, r *http.Request) {
	cameras, err := h.service.GetAllCameras(r.Context())
	if err != nil {
		h.deps.Logger.Println("error fetching cameras:", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	helpers.WriteJSON(w, http.StatusOK, cameras, nil)
}
