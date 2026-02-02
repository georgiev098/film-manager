package handlers

import (
	"net/http"

	"github.com/georgiev098/film-manager/backend/internal/core"
	"github.com/georgiev098/film-manager/backend/internal/helpers"
	"github.com/georgiev098/film-manager/backend/internal/repositories"
)

type CameraHandler struct {
	deps *core.AppDeps
	repo *repositories.CameraRepo
}

func NewCameraHandler(deps *core.AppDeps) *CameraHandler {
	return &CameraHandler{
		deps: deps,
		repo: repositories.NewCameraRepo(deps.DB),
	}
}

func (h *CameraHandler) GetAllCameras(w http.ResponseWriter, r *http.Request) {
	cameras, err := h.repo.GetAllCameras(r.Context())
	if err != nil {
		h.deps.Logger.Println("error fetching cameras:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	helpers.WriteJSON(w, http.StatusOK, cameras, nil)
}
