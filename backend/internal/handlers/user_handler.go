package handlers

import (
	"net/http"

	"github.com/georgiev098/film-manager/backend/internal/core"
	"github.com/georgiev098/film-manager/backend/internal/helpers"
	"github.com/georgiev098/film-manager/backend/internal/repositories"
	"github.com/georgiev098/film-manager/backend/internal/services"
)

type UserHandler struct {
	service *services.UserService
	deps    *core.AppDeps
}

func NewUserHandler(deps *core.AppDeps) *UserHandler {
	repo := repositories.NewUserRepo(deps.DB)
	service := services.NewUserService(repo)

	return &UserHandler{
		service: service,
		deps:    deps,
	}
}

func (h *UserHandler) SignUp(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var input struct {
		Email     string `json:"email"`
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Password  string `json:"password"`
	}

	err := helpers.ReadJSON(w, r, &input)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	user, err := h.service.SignUp(ctx, input.Email, input.Password, input.FirstName, input.LastName)

	if err != nil {
		http.Error(w, "could not create user", http.StatusBadRequest)
		return
	}

	helpers.WriteJSON(w, http.StatusCreated, user, nil)
}

func (h *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	err := helpers.ReadJSON(w, r, &input)
	if err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}

	user, err := h.service.Login(ctx, input.Email, input.Password)
	if err != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	// TODO: JWT at this point
	helpers.WriteJSON(w, http.StatusOK, user, nil)
}
