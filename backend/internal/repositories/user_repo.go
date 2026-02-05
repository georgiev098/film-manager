package repositories

import (
	"context"

	"github.com/georgiev098/film-manager/backend/internal/models"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepo(db *gorm.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (r *UserRepository) CraeteUser(ctx context.Context, user *models.User) error {
	return r.db.WithContext(ctx).Create(user).Error
}

func (r *UserRepository) GetUserByEmail(ctx context.Context, userEmail string) (*models.User, error) {
	var user models.User
	err := r.db.WithContext(ctx).Where("email = ?", userEmail).First(user).Error

	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) GetUserByID(ctx context.Context, userID uint) (*models.User, error) {
	var user models.User
	err := r.db.WithContext(ctx).First(user, userID).Error
	if err != nil {
		return nil, err
	}
	return &user, nil
}
