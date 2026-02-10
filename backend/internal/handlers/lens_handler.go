package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/georgiev098/film-manager/backend/internal/core"
	"github.com/georgiev098/film-manager/backend/internal/dtos"
	"github.com/georgiev098/film-manager/backend/internal/helpers"
	"github.com/georgiev098/film-manager/backend/internal/models"
	"github.com/georgiev098/film-manager/backend/internal/repositories"
	"github.com/georgiev098/film-manager/backend/internal/services"
	"github.com/go-chi/chi/v5"
	"gorm.io/gorm"
)

type LensHandler struct {
	deps    *core.AppDeps
	service *services.LensService
}

func NewLensHandler(deps *core.AppDeps) *LensHandler {
	repo := repositories.NewLensRepo(deps.DB)
	service := services.NewLensService(repo)

	return &LensHandler{
		deps:    deps,
		service: service,
	}
}

func (h *LensHandler) GetAllLenses(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	lenses, err := h.service.GetAllLenses(ctx)
	if err != nil {
		h.deps.Logger.Println("error fetching lenses:", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	helpers.WriteJSON(w, http.StatusOK, lenses, nil)
}

func (h *LensHandler) GetAllLensesForUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	userID := uint(1)

	lenses, err := h.service.GetAllForUser(ctx, userID)
	if err != nil {
		h.deps.Logger.Println("error fetching lenses:", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	helpers.WriteJSON(w, http.StatusOK, lenses, nil)
}

func (h *LensHandler) CreateLens(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	userID := uint(1)

	var lens models.Lens

	err := helpers.ReadJSON(w, r, &lens)
	if err != nil {
		h.deps.Logger.Println("invalid json:", err)
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	lens.UserID = userID

	err = h.deps.Validate.Struct(lens)
	if err != nil {
		// map errors with helper
		errMap := helpers.ParseValidationErrors(err)
		helpers.WriteJSON(w, http.StatusBadRequest, map[string]any{"errors": errMap}, nil)
		return
	}

	err = h.service.CreateLens(ctx, &lens)
	if err != nil {
		h.deps.Logger.Println("error creating lens:", err)
		http.Error(w, "could not create lens", http.StatusInternalServerError)
		return
	}

	helpers.WriteJSON(w, http.StatusCreated, lens, nil)
}

func (h *LensHandler) GetLensByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	idParam := chi.URLParam(r, "id")
	lensID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		http.Error(w, "invalid lens id", http.StatusBadRequest)
		return
	}

	lens, err := h.service.GetLensByID(ctx, uint(lensID))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			http.Error(w, "lens not found", http.StatusNotFound)
		} else {
			h.deps.Logger.Println("error fetching lens:", err)
			http.Error(w, "internal server error", http.StatusInternalServerError)
		}
		return
	}

	helpers.WriteJSON(w, http.StatusOK, lens, nil)
}

func (h *LensHandler) UpdateLens(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	userID := uint(1) // get from auth later

	idParam := chi.URLParam(r, "id")
	lensID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		http.Error(w, "invalid lens id", http.StatusBadRequest)
		return
	}

	var inputLens dtos.LensUpdate
	err = helpers.ReadJSON(w, r, &inputLens)
	if err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}

	err = h.deps.Validate.Struct(inputLens)
	if err != nil {
		errMap := helpers.ParseValidationErrors(err)
		helpers.WriteJSON(w, http.StatusBadRequest, map[string]any{"errors": errMap}, nil)
		return
	}

	updatedLens, err := h.service.UpdateLens(ctx, uint(lensID), userID, inputLens)
	if err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	helpers.WriteJSON(w, http.StatusOK, updatedLens, nil)

}

func (h *LensHandler) DeleteLens(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	userID := uint(1) // change to retrieve from auth

	idParam := chi.URLParam(r, "id")
	lensID, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		http.Error(w, "invalid lens id", http.StatusBadRequest)
		return
	}

	err = h.service.DeleteLens(ctx, uint(lensID), userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
