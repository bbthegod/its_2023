package usecase

import (
	"its-backend/package/domain/model"
	"its-backend/package/usecase/repository"
	"net/http"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type questionUsecase struct {
	questionRepository repository.QuestionRepository
}

type Question interface {
	List(skip int64, limit int64, search string) ([]*model.Question, int64, int, error)
	GetOne(id primitive.ObjectID) (*model.Question, int, error)
	Create(question *model.Question) (*model.Question, int, error)
	Update(id primitive.ObjectID, question *model.Question) (*model.Question, int, error)
	Delete(id primitive.ObjectID) (int, error)
}

func NewQuestionUsecase(r repository.QuestionRepository) Question {
	return &questionUsecase{r}
}

func (usecase *questionUsecase) List(skip int64, limit int64, search string) ([]*model.Question, int64, int, error) {
	res, count, code, err := usecase.questionRepository.List(skip, limit, search)
	if err != nil {
		return nil, 0, code, err
	}

	return res, count, http.StatusOK, nil
}

func (usecase *questionUsecase) GetOne(id primitive.ObjectID) (*model.Question, int, error) {
	res, code, err := usecase.questionRepository.GetOne(id)
	if err != nil {
		return nil, code, err
	}

	return res, code, nil
}

func (usecase *questionUsecase) Create(question *model.Question) (*model.Question, int, error) {
	res, code, err := usecase.questionRepository.Create(question)
	if err != nil {
		return nil, code, err
	}

	return res, 0, nil
}

func (usecase *questionUsecase) Update(id primitive.ObjectID, question *model.Question) (*model.Question, int, error) {
	res, code, err := usecase.questionRepository.Update(id, question)
	if err != nil {
		return nil, code, err
	}

	return res, code, nil
}

func (usecase *questionUsecase) Delete(id primitive.ObjectID) (int, error) {
	code, err := usecase.questionRepository.Delete(id)
	if err != nil {
		return code, err
	}

	return code, nil
}
