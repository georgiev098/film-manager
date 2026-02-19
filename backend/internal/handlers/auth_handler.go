package handlers

import (
	"net/http"
	"time"

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

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Path:     "/auth",
		HttpOnly: true,
		Secure:   false, // true in production (HTTPS)
		SameSite: http.SameSiteStrictMode,
		Expires:  time.Now().Add(h.deps.Config.Auth.RefreshTTL),
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // true in production
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now().Add(h.deps.Config.Auth.AccessTTL),
	})

	helpers.WriteJSON(w, http.StatusCreated, map[string]any{
		"user": user,
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

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Path:     "/auth",
		HttpOnly: true,
		Secure:   false, // true in production (HTTPS)
		SameSite: http.SameSiteStrictMode,
		Expires:  time.Now().Add(7 * 24 * time.Hour), // match refreshTTL
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // true in production
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now().Add(h.deps.Config.Auth.AccessTTL),
	})

	helpers.WriteJSON(w, http.StatusOK, map[string]any{
		"message": "ok",
	}, nil)
}

func (h *AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		http.Error(w, "missing refresh token", http.StatusUnauthorized)
		return
	}

	oldToken := cookie.Value

	newAccessToken, newRefreshToken, err := h.authService.Refresh(ctx, oldToken)
	if err != nil {
		http.Error(w, "refresh token required", http.StatusBadRequest)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    newRefreshToken,
		Path:     "/auth",
		HttpOnly: true,
		Secure:   false, // true in production
		SameSite: http.SameSiteStrictMode,
		Expires:  time.Now().Add(h.deps.Config.Auth.RefreshTTL),
	})
	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    newAccessToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // true in production
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now().Add(h.deps.Config.Auth.AccessTTL),
	})

	helpers.WriteJSON(w, http.StatusOK, map[string]any{
		"message": "ok",
	}, nil)
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	// Read refresh token from httpOnly cookie
	cookie, err := r.Cookie("refresh_token")
	if err != nil {
		http.Error(w, "refresh token missing", http.StatusBadRequest)
		return
	}
	refreshToken := cookie.Value

	// Revoke the refresh token in the database
	err = h.authService.Logout(ctx, refreshToken)
	if err != nil {
		http.Error(w, "could not logout", http.StatusInternalServerError)
		return
	}

	// Clear the cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    "",
		Path:     "/auth",
		HttpOnly: true,
		Secure:   false, // true in production
		Expires:  time.Unix(0, 0),
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		Expires:  time.Unix(0, 0),
	})

	w.WriteHeader(http.StatusNoContent)
}
