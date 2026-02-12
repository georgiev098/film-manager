package repositories

import (
	"context"
	"time"

	"github.com/georgiev098/film-manager/backend/internal/models"
	"gorm.io/gorm"
)

type RefreshTokenRepository struct {
	db *gorm.DB
}

// constructor
func CreateRefreshTokenRepository(db *gorm.DB) *RefreshTokenRepository {
	return &RefreshTokenRepository{
		db: db,
	}
}

// create a new refresh token
func (r *RefreshTokenRepository) Create(ctx context.Context, token *models.RefreshToken) error {
	return r.db.WithContext(ctx).Create(token).Error
}

// Find refresh token by hash
func (r *RefreshTokenRepository) FindTokenByHash(ctx context.Context, tokenHash string) (*models.RefreshToken, error) {
	var token models.RefreshToken

	err := r.db.WithContext(ctx).Where("token_hash = ?", tokenHash).First(&token).Error
	if err != nil {
		return nil, err
	}

	return &token, nil
}

// Revoke a refresh token by ID
func (r *RefreshTokenRepository) Revoke(ctx context.Context, tokenId uint) error {
	return r.db.WithContext(ctx).
		Model(&models.RefreshToken{}). // ← specify table/model
		Where("id = ?", tokenId).
		Update("revoked", true).Error
}

// Revoke all refresh tokens by userID (logout everywhere)
func (r *RefreshTokenRepository) RevokeAllByUser(ctx context.Context, userID uint) error {
	return r.db.WithContext(ctx).
		Model(&models.RefreshToken{}).
		Where("user_id = ?", userID).
		Update("revoked", true).Error
}

// Delete expired tokens
func (r *RefreshTokenRepository) DeleteExpired(ctx context.Context) error {
	return r.db.WithContext(ctx).Where("expires_at < ?", time.Now()).Delete(&models.RefreshToken{}).Error
}
