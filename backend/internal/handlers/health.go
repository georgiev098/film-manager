package handlers

import (
	"net/http"

	"github.com/georgiev098/film-manager/backend/internal/core"
)

type HealthHandler struct {
	deps *core.AppDeps
}

func NewHealthHandler(deps *core.AppDeps) *HealthHandler {
	return &HealthHandler{deps: deps}
}

func (h *HealthHandler) Check(w http.ResponseWriter, r *http.Request) {
	h.deps.Logger.Println("Health check called")

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("ok"))
}
