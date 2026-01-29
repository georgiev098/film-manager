package middlewares

import (
	"net/http"

	"github.com/georgiev098/film-manager/backend/internal/core"
	"github.com/go-chi/cors"
)

// CORS returns a Chi middleware configured using AppDeps.Config
func CORS(deps *core.AppDeps) func(next http.Handler) http.Handler {
	return cors.Handler(cors.Options{
		AllowedOrigins:   deps.Config.AllowedOrigins, // e.g. []string{"http://localhost:5173"}
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // 5 minutes
	})
}
