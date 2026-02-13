package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/georgiev098/film-manager/backend/internal/core"
	"github.com/georgiev098/film-manager/backend/internal/dtos"
	"github.com/georgiev098/film-manager/backend/internal/helpers"
	"github.com/georgiev098/film-manager/backend/internal/middlewares"
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
	userID, ok := middlewares.GetUserIDFromContext(r.Context())
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	cameras, err := h.service.GetAllForUser(r.Context(), userID)
	if err != nil {
		h.deps.Logger.Println("error fetching cameras:", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	helpers.WriteJSON(w, http.StatusOK, cameras, nil)
}

func (h *CameraHandler) CreateCamera(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	userID, ok := middlewares.GetUserIDFromContext(r.Context())
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}
	var camera models.Camera

	err := helpers.ReadJSON(w, r, &camera)
	if err != nil {
		h.deps.Logger.Println("invalid json:", err)
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	// Get UserID from auth
	camera.UserID = userID

	err = h.deps.Validate.Struct(camera)
	if err != nil {
		// map errors with helper
		errMap := helpers.ParseValidationErrors(err)
		helpers.WriteJSON(w, http.StatusBadRequest, map[string]any{"errors": errMap}, nil)
		return
	}

	err = h.service.CreateCamera(ctx, &camera)
	if err != nil {
		h.deps.Logger.Println("error creating camera:", err)
		http.Error(w, "could not create camera", http.StatusInternalServerError)
		return
	}

	helpers.WriteJSON(w, http.StatusCreated, camera, nil)
}

func (h *CameraHandler) GetCameraByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	idParam := chi.URLParam(r, "id")
	cameraID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		http.Error(w, "invalid camera id", http.StatusBadRequest)
		return
	}

	userID, ok := middlewares.GetUserIDFromContext(r.Context())
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	camera, err := h.service.GetCameraByID(ctx, uint(cameraID), userID)
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

	userID, ok := middlewares.GetUserIDFromContext(r.Context())
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var inputCamera dtos.CameraUpdate

	err = helpers.ReadJSON(w, r, &inputCamera)
	if err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}

	err = h.deps.Validate.Struct(inputCamera)
	if err != nil {
		// map errors with helper
		errMap := helpers.ParseValidationErrors(err)
		helpers.WriteJSON(w, http.StatusBadRequest, map[string]any{"errors": errMap}, nil)
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

	userID, ok := middlewares.GetUserIDFromContext(r.Context())
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	err = h.service.DeleteCamera(ctx, uint(cameraID), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
