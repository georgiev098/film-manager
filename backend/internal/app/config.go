package app

import (
	"flag"
	"fmt"
	"os"

	"github.com/georgiev098/film-manager/backend/internal/core"
)

func LoadConfig() core.Config {
	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		dbHost = "localhost"
	}

	var cfg core.Config

	flag.IntVar(&cfg.Port, "port", 8080, "Server port")
	flag.StringVar(&cfg.Env, "env", "dev", "Environment {dev|prod}")
	flag.StringVar(
		&cfg.Db.Dsn,
		"dsn",
		fmt.Sprintf(
			"%s:%s@tcp(%s:3306)/film_manager?parseTime=true&tls=false",
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			dbHost,
		),
		"MySQL DSN",
	)
	flag.StringVar(&cfg.Api, "api", "http://localhost:4000", "API URL")

	flag.Parse()
	return cfg
}
