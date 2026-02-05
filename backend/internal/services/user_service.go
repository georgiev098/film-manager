package services

import (
	"context"
	"errors"
	"strings"

	"github.com/georgiev098/film-manager/backend/internal/helpers"
	"github.com/georgiev098/film-manager/backend/internal/models"
	"github.com/georgiev098/film-manager/backend/internal/repositories"
)

type UserService struct {
	repo *repositories.UserRepository
}

func NewUserService(repo *repositories.UserRepository) *UserService {
	return &UserService{
		repo: repo,
	}
}

func (s *UserService) SignUp(ctx context.Context, email, password, firstName, lastName string) (*models.User, error) {

	hash, err := helpers.HasPassword(password)
	if err != nil {
		return nil, err
	}

	email = strings.ToLower(strings.TrimSpace(email))

	newUser := &models.User{
		Email:        email,
		PasswordHash: string(hash),
		FirstName:    firstName,
		LastName:     lastName,
	}

	err = s.repo.CraeteUser(ctx, newUser)
	if err != nil {
		return nil, err
	}

	return newUser, nil
}

func (s *UserService) Login(ctx context.Context, email, password string) (*models.User, error) {
	email = strings.ToLower(strings.TrimSpace(email))

	user, err := s.repo.GetUserByEmail(ctx, email)
	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	err = helpers.CompareHashAndPassword(user.PasswordHash, password)
	if err != nil {
		return nil, errors.New("invalid credentials")

	}
	return user, nil
}
