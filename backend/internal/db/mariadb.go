package db

import (
	"context"
	"log"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func Connect(ctx context.Context, dsn string) (*gorm.DB, error) {
	db, err := gorm.Open(mysql.Open(dsn))
	if err != nil {
		log.Fatal("Could not connect to DB:", err)
		return nil, err
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Could not connect to DB:", err)
		return nil, err
	}

	sqlDB.SetMaxOpenConns(10)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(time.Hour)

	// Context-aware ping
	if err := ping(ctx, sqlDB); err != nil {
		log.Fatal("Error pinging DB:", err)
		return nil, err
	}

	return db, nil
}

func ping(ctx context.Context, db interface {
	PingContext(context.Context) error
}) error {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	return db.PingContext(ctx)
}
