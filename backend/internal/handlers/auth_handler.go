package handlers

import (
	"net/http"

	"github.com/georgiev098/film-manager/backend/internal/core"
	"github.com/georgiev098/film-manager/backend/internal/dtos"
	"github.com/georgiev098/film-manager/backend/internal/helpers"
	"github.com/georgiev098/film-manager/backend/internal/repositories"
	"github.com/georgiev098/film-manager/backend/internal/services"
)

type AuthHandler struct {
	deps        *core.AppDeps
	userService *services.UserService
	authService *services.AuthService
}

// constructor
func NewAuthHandler(deps *core.AppDeps) *AuthHandler {
	userRepo := repositories.NewUserRepo(deps.DB)
	refreshTokenRepo := repositories.CreateRefreshTokenRepository(deps.DB)

	userService := services.NewUserService(userRepo)
	authService := services.NewAuthService(refreshTokenRepo, deps.Config.Auth.AccessSecret, deps.Config.Auth.AccessTTL, deps.Config.Auth.RefreshTTL)

	return &AuthHandler{
		deps:        deps,
		userService: userService,
		authService: authService,
	}
}

func (h *AuthHandler) SignUp(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var input dtos.SignUpRequest

	err := helpers.ReadJSON(w, r, &input)
	if err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	err = h.deps.Validate.Struct(input)
	if err != nil {
		errMap := helpers.ParseValidationErrors(err)
		helpers.WriteJSON(w, http.StatusBadRequest, map[string]any{"errors": errMap}, nil)
		return
	}

	user, err := h.userService.SignUp(ctx, input.Email, input.Password, input.FirstName, input.LastName)
	if err != nil {
		h.deps.Logger.Println("signup error:", err)
		http.Error(w, "could not create user", http.StatusInternalServerError)
		return
	}

	accessToken, refreshToken, err := h.authService.Login(ctx, user.ID)
	if err != nil {
		h.deps.Logger.Println("token issue error:", err)
		http.Error(w, "could not issue tokens", http.StatusInternalServerError)
		return
	}

	helpers.WriteJSON(w, http.StatusCreated, map[string]any{
		"user":          user,
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	}, nil)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var input dtos.LoginRequest

	err := helpers.ReadJSON(w, r, &input)
	if err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	user, err := h.userService.Login(ctx, input.Email, input.Password)
	if err != nil {
		http.Error(w, "invalid credentials", http.StatusUnauthorized)
		return
	}

	accessToken, refreshToken, err := h.authService.Login(ctx, user.ID)
	if err != nil {
		h.deps.Logger.Println("token issue error:", err)
		http.Error(w, "could not issue tokens", http.StatusInternalServerError)
		return
	}

	helpers.WriteJSON(w, http.StatusOK, map[string]any{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	}, nil)
}

func (h *AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var body struct {
		RefreshToken string `json:"refresh_token"`
	}

	err := helpers.ReadJSON(w, r, &body)
	if err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if body.RefreshToken == "" {
		http.Error(w, "refresh token required", http.StatusBadRequest)
		return
	}

	newAccessToken, newRefreshToken, err := h.authService.Refresh(ctx, body.RefreshToken)
	if err != nil {
		http.Error(w, "refresh token required", http.StatusBadRequest)
		return
	}

	helpers.WriteJSON(w, http.StatusOK, map[string]any{
		"access_token":  newAccessToken,
		"refresh_token": newRefreshToken,
	}, nil)
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var body struct {
		RefreshToken string `json:"refresh_token"`
	}

	err := helpers.ReadJSON(w, r, &body)
	if err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	if body.RefreshToken == "" {
		http.Error(w, "refresh token required", http.StatusBadRequest)
	}

	err = h.authService.Logout(ctx, body.RefreshToken)
	if err != nil {
		http.Error(w, "could not logout", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
