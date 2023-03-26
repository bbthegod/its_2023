package usecase

import (
	"its-backend/package/domain/model"
	"its-backend/package/usecase/repository"
	"net/http"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type playUsecase struct {
	playRepository repository.PlayRepository
}

type Play interface {
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

func NewPlayUsecase(r repository.PlayRepository) Play {
	return &playUsecase{r}
}

func (usecase *playUsecase) List(skip int64, limit int64) ([]*model.Play, int64, int, error) {
	res, count, code, err := usecase.playRepository.List(skip, limit)
	if err != nil {
		return nil, 0, code, err
	}

	return res, count, http.StatusOK, nil
}

func (usecase *playUsecase) GetUserPlay(id primitive.ObjectID) (*model.Play, int, error) {
	res, code, err := usecase.playRepository.GetUserPlay(id)
	if err != nil {
		return nil, code, err
	}

	return res, code, nil
}

func (usecase *playUsecase) Leaderboard() ([]*model.Play, int, error) {
	res, code, err := usecase.playRepository.Leaderboard()
	if err != nil {
		return nil, code, err
	}

	return res, http.StatusOK, nil
}

func (usecase *playUsecase) Interview(id primitive.ObjectID, play *model.Play) (int, error) {
	code, err := usecase.playRepository.Interview(id, play)
	if err != nil {
		return code, err
	}

	return code, nil
}

func (usecase *playUsecase) Delete(id primitive.ObjectID) (int, error) {
	code, err := usecase.playRepository.Delete(id)
	if err != nil {
		return code, err
	}

	return code, nil
}

func (usecase *playUsecase) GetSingle(id primitive.ObjectID) (*model.Play, int, error) {
	res, code, err := usecase.playRepository.GetSingle(id)
	if err != nil {
		return nil, code, err
	}

	return res, code, nil
}
func (usecase *playUsecase) StartPlay(id primitive.ObjectID) (*model.Play, int, error) {
	res, code, err := usecase.playRepository.StartPlay(id)
	if err != nil {
		return nil, code, err
	}

	return res, code, nil
}
func (usecase *playUsecase) EndPlay(id primitive.ObjectID) (int, error) {
	code, err := usecase.playRepository.EndPlay(id)
	if err != nil {
		return code, err
	}

	return code, nil
}
