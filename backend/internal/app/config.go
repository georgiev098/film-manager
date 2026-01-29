package app

import (
	"flag"
	"fmt"
	"os"

	"github.com/georgiev098/film-manager/backend/internal/core"
	"github.com/georgiev098/film-manager/backend/internal/helpers"
)

func LoadConfig() core.Config {
	var cfg core.Config

	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
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

	// Flags to optionally override env vars
	flag.IntVar(&cfg.Port, "port", helpers.AtoiOrDefault(port, 8080), "Server port")
	flag.StringVar(&cfg.Env, "env", env, "Environment {dev|prod}")
	flag.StringVar(
		&cfg.Db.Dsn,
		"dsn",
		fmt.Sprintf("%s:%s@tcp(%s:3306)/%s?parseTime=true&tls=false", dbUser, dbPassword, dbHost, os.Getenv("DB_NAME")),
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
