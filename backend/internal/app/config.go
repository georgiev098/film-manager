package app

import (
	"flag"
	"fmt"
	"os"
	"time"

	"github.com/georgiev098/film-manager/backend/internal/core"
	"github.com/georgiev098/film-manager/backend/internal/helpers"
)

func LoadConfig() core.Config {
	var cfg core.Config

	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "film_manager"
	}

	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		dbUser = "film_user"
	}

	dbPassword := os.Getenv("DB_PASSWORD")
	if dbPassword == "" {
		dbPassword = "film_pass"
	}

	apiURL := os.Getenv("VITE_API_URL")
	if apiURL == "" {
		apiURL = "http://localhost:4000"
	}

	port := os.Getenv("API_PORT")
	if port == "" {
		port = "8080"
	}

	env := os.Getenv("ENV")
	if env == "" {
		env = "dev"
	}

	// JWT Config
	jwtSecret := os.Getenv("JWT_ACCESS_SECRET")
	if jwtSecret == "" {
		// In dev allow fallback, but NEVER in prod
		if env == "dev" {
			jwtSecret = "dev-secret-change-me"
		} else {
			panic("JWT_ACCESS_SECRET is required in production")
		}
	}

	accessTTL := os.Getenv("JWT_ACCESS_TTL_MINUTES")
	if accessTTL == "" {
		cfg.Auth.AccessTTL = 15 * time.Minute
	} else {
		cfg.Auth.AccessTTL = time.Duration(helpers.AtoiOrDefault(accessTTL, 15)) * time.Minute
	}

	refreshTTL := os.Getenv("JWT_REFRESH_TTL_DAYS")
	if refreshTTL == "" {
		cfg.Auth.RefreshTTL = 7 * 24 * time.Hour
	} else {
		cfg.Auth.RefreshTTL = time.Duration(helpers.AtoiOrDefault(refreshTTL, 7)) * 24 * time.Hour
	}

	cfg.Auth.AccessSecret = jwtSecret

	// Flags to optionally override env vars
	flag.IntVar(&cfg.Port, "port", helpers.AtoiOrDefault(port, 8080), "Server port")
	flag.StringVar(&cfg.Env, "env", env, "Environment {dev|prod}")
	flag.StringVar(
		&cfg.Db.Dsn,
		"dsn",
		fmt.Sprintf("%s:%s@tcp(%s:3306)/%s?parseTime=true&tls=false", dbUser, dbPassword, dbHost, dbName),
		"MySQL DSN",
	)
	flag.StringVar(&cfg.Api, "api", apiURL, "API URL")

	flag.Parse()

	// Allowed origins
	if cfg.Env == "dev" {
		cfg.AllowedOrigins = []string{"*"}
	} else {
		cfg.AllowedOrigins = []string{"https://myapp.com"}
	}

	return cfg
}
