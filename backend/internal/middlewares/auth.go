package middlewares

import (
	"context"
	"net/http"
	"strings"

	"github.com/georgiev098/film-manager/backend/internal/core"
	"github.com/golang-jwt/jwt/v5"
)

type contextKey string

const userIDKey contextKey = "userID"

func Auth(deps *core.AppDeps) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			var tokenString string

			// 1. Try Authorization header (for Postman/mobile)
			authHeader := r.Header.Get("Authorization")
			if after, ok := strings.CutPrefix(authHeader, "Bearer "); ok {
				tokenString = after
			}

			// 2. Fallback to cookie (browser)
			if tokenString == "" {
				cookie, err := r.Cookie("access_token")
				if err != nil {
					http.Error(w, "unauthorized", http.StatusUnauthorized)
					return
				}
				tokenString = cookie.Value
			}

			token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
				return []byte(deps.Config.Auth.AccessSecret), nil
			})

			if err != nil || !token.Valid {
				http.Error(w, "invalid token", http.StatusUnauthorized)
				return
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				http.Error(w, "invalid token claims", http.StatusUnauthorized)
				return
			}

			userIDFloat, ok := claims["user_id"].(float64)
			if !ok {
				http.Error(w, "invalid user id", http.StatusUnauthorized)
				return
			}

			userID := uint(userIDFloat)

			ctx := context.WithValue(r.Context(), userIDKey, userID)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func GetUserIDFromContext(ctx context.Context) (uint, bool) {
	userID, ok := ctx.Value(userIDKey).(uint)
	return userID, ok
}
