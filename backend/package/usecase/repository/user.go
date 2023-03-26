package repository

import (
	"its-backend/package/domain/model"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserRepository interface {
	List(skip int64, limit int64, search string) ([]*model.User, int64, int, error)
	GetOne(id primitive.ObjectID) (*model.User, int, error)
	Create(user *model.User) (*model.User, int, error)
	Update(id primitive.ObjectID, user *model.User) (*model.User, int, error)
	Delete(id primitive.ObjectID) (int, error)
}
