package repository

import (
	"its-backend/package/domain/model"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type PlayRepository interface {
	// Admin
	List(skip int64, limit int64) ([]*model.Play, int64, int, error)
	GetUserPlay(id primitive.ObjectID) (*model.Play, int, error)
	Leaderboard() ([]*model.Play, int, error)
	Interview(id primitive.ObjectID, play *model.Play) (int, error)
	Delete(id primitive.ObjectID) (int, error)

	// User
	GetSingle(id primitive.ObjectID) (*model.Play, int, error)
	StartPlay(id primitive.ObjectID) (*model.Play, int, error)
	EndPlay(id primitive.ObjectID) (int, error)
}
