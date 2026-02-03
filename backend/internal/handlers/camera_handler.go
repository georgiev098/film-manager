package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/georgiev098/film-manager/backend/internal/core"
	"github.com/georgiev098/film-manager/backend/internal/helpers"
	"github.com/georgiev098/film-manager/backend/internal/models"
	"github.com/georgiev098/film-manager/backend/internal/repositories"
	"github.com/georgiev098/film-manager/backend/internal/services"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
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

func (h *CameraHandler) GetAllCamerasForUser(w http.ResponseWriter, r *http.Request) {
	userId := uint(2) //implement auth logic later
	cameras, err := h.service.GetAllForUser(r.Context(), userId)
	if err != nil {
		h.deps.Logger.Println("error fetching cameras:", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	helpers.WriteJSON(w, http.StatusOK, cameras, nil)
}

func (h *CameraHandler) CreateCamera(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var camera models.Camera

	err := helpers.ReadJSON(w, r, &camera)
	if err != nil {
		h.deps.Logger.Println("invalid json:", err)
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// Get UserID from auth
	camera.UserID = uint(2)

	err = h.service.CreateCamera(ctx, &camera)
	if err != nil {
		h.deps.Logger.Println("error creating camera:", err)
		http.Error(w, "could not create camera", http.StatusBadRequest)
		return
	}

	helpers.WriteJSON(w, http.StatusOK, camera, nil)
}

func (h *CameraHandler) GetCameraByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	idParam := chi.URLParam(r, "id")
	cameraID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		http.Error(w, "invalid camera id", http.StatusBadRequest)
		return
	}

	camera, err := h.service.GetCameraByID(ctx, uint(cameraID))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, "camera not found", http.StatusNotFound)
		} else {
			h.deps.Logger.Println("error fetching camera:", err)
			http.Error(w, "internal server error", http.StatusInternalServerError)
		}
		return
	}

	helpers.WriteJSON(w, http.StatusOK, camera, nil)
}

func (h *CameraHandler) UpdateCamera(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	idParam := chi.URLParam(r, "id")
	cameraID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		http.Error(w, "invalid camera id", http.StatusBadRequest)
		return
	}

	userID := uint(2) // get from auth later

	var inputCamera models.Camera

	err = helpers.ReadJSON(w, r, &inputCamera)
	if err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}

	updatedCamera, err := h.service.UpdateCamera(ctx, uint(cameraID), userID, inputCamera)
	if err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	helpers.WriteJSON(w, http.StatusOK, updatedCamera, nil)
}

func (h *CameraHandler) DeleteCamera(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	idParam := chi.URLParam(r, "id")
	cameraID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		http.Error(w, "invalid camera id", http.StatusBadRequest)
		return
	}

	userID := uint(2) // change to retrieve from auth

	err = h.service.DeleteCamera(ctx, uint(cameraID), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	helpers.WriteJSON(w, http.StatusNoContent, nil, nil)
}
