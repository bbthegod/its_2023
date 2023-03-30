package repository

import "its-backend/package/domain/model"

type AuthRepository interface {
	Login(user *model.User) (*model.User, *string, int, error)
}
