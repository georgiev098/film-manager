package services

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"time"

	"github.com/georgiev098/film-manager/backend/internal/models"
	"github.com/georgiev098/film-manager/backend/internal/repositories"
	"github.com/golang-jwt/jwt/v5"
)

type AuthService struct {
	refreshTokenRepo *repositories.RefreshTokenRepository
	accessSecret     string
	accessTTL        time.Duration
	refreshTTL       time.Duration
}

// Constructor
func NewAuthService(repo *repositories.RefreshTokenRepository, accessSecret string, accessTTL, refreshTTL time.Duration) *AuthService {
	return &AuthService{
		refreshTokenRepo: repo,
		accessSecret:     accessSecret,
		accessTTL:        accessTTL,
		refreshTTL:       refreshTTL,
	}
}

// Custom JWT claims
type AccessClaims struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

// GenerateAccessToken creates a JWT access token for a user
func (s *AuthService) GenerateAccessToken(userID uint) (string, error) {
	claims := AccessClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(s.accessTTL)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err := token.SignedString([]byte(s.accessSecret))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

// GenerateRefreshToken creates a random refresh token string and returns a DB-ready model
func (s *AuthService) GenerateRefreshToken(userID uint) (string, *models.RefreshToken, error) {
	// Generate random 64-byte token
	raw := make([]byte, 64)
	_, err := rand.Read(raw)
	if err != nil {
		return "", nil, err
	}

	tokenString := hex.EncodeToString(raw)
	hash := sha256.Sum256([]byte(tokenString))
	tokenHash := hex.EncodeToString(hash[:])

	refreshToken := &models.RefreshToken{
		UserID:    userID,
		TokenHash: tokenHash,
		ExpiresAt: time.Now().Add(s.refreshTTL),
		Revoked:   false,
	}

	return tokenString, refreshToken, nil
}

// Login handles issuing tokens for a verified user
func (s *AuthService) Login(ctx context.Context, userID uint) (accessToken string, refreshToken string, err error) {
	accessToken, err = s.GenerateAccessToken(userID)
	if err != nil {
		return "", "", err
	}

	refreshToken, tokenModel, err := s.GenerateRefreshToken(userID)
	if err != nil {
		return "", "", err
	}

	err = s.refreshTokenRepo.Create(ctx, tokenModel)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

// Refresh rotates a refresh token and returns new tokens
func (s *AuthService) Refresh(ctx context.Context, oldToken string) (newAccessToken string, newRefreshToken string, err error) {
	hash := sha256.Sum256([]byte(oldToken))
	hashHex := hex.EncodeToString(hash[:])

	rt, err := s.refreshTokenRepo.FindTokenByHash(ctx, hashHex)
	if err != nil {
		return "", "", errors.New("invalid refresh token")
	}

	if rt.Revoked || rt.ExpiresAt.Before(time.Now()) {
		return "", "", errors.New("refresh token expired or revoked")
	}

	// Rotation: revoke old token
	if err := s.refreshTokenRepo.Revoke(ctx, rt.ID); err != nil {
		return "", "", err
	}

	// Issue new tokens using correct user ID
	return s.Login(ctx, rt.UserID)
}

// Logout revokes a refresh token
func (s *AuthService) Logout(ctx context.Context, refreshToken string) error {
	hash := sha256.Sum256([]byte(refreshToken))
	hashHex := hex.EncodeToString(hash[:])

	rt, err := s.refreshTokenRepo.FindTokenByHash(ctx, hashHex)
	if err != nil {
		return nil // Already gone, safe
	}

	return s.refreshTokenRepo.Revoke(ctx, rt.ID)
}
