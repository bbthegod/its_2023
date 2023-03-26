package repository

import (
	"its-backend/package/domain/model"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type QuestionRepository interface {
	List(skip int64, limit int64, search string) ([]*model.Question, int64, int, error)
	GetOne(id primitive.ObjectID) (*model.Question, int, error)
	Create(question *model.Question) (*model.Question, int, error)
	Update(id primitive.ObjectID, question *model.Question) (*model.Question, int, error)
	Delete(id primitive.ObjectID) (int, error)
}
