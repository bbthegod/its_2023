package usecase

import (
	"its-backend/package/domain/model"
	"its-backend/package/usecase/repository"
	"net/http"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type userUsecase struct {
	userRepository repository.UserRepository
}

type User interface {
	List(skip int64, limit int64, search string) ([]*model.User, int64, int, error)
	GetOne(id primitive.ObjectID) (*model.User, int, error)
	Create(user *model.User) (*model.User, int, error)
	Update(id primitive.ObjectID, user *model.User) (*model.User, int, error)
	Delete(id primitive.ObjectID) (int, error)
}

func NewUserUsecase(r repository.UserRepository) User {
	return &userUsecase{r}
}

func (usecase *userUsecase) List(skip int64, limit int64, search string) ([]*model.User, int64, int, error) {
	user, count, code, err := usecase.userRepository.List(skip, limit, search)
	if err != nil {
		return nil, 0, code, err
	}

	for _, s := range user {
		s.Password = ""
	}

	return user, count, http.StatusOK, nil
}

func (usecase *userUsecase) GetOne(id primitive.ObjectID) (*model.User, int, error) {
	user, code, err := usecase.userRepository.GetOne(id)
	if err != nil {
		return nil, code, err
	}

	user.Password = ""

	return user, code, nil
}

func (usecase *userUsecase) Create(user *model.User) (*model.User, int, error) {
	user, code, err := usecase.userRepository.Create(user)
	if err != nil {
		return nil, code, err
	}

	user.Password = ""

	return user, 0, nil
}

func (usecase *userUsecase) Update(id primitive.ObjectID, user *model.User) (*model.User, int, error) {
	user, code, err := usecase.userRepository.Update(id, user)
	if err != nil {
		return nil, code, err
	}

	user.Password = ""

	return user, code, nil
}

func (usecase *userUsecase) Delete(id primitive.ObjectID) (int, error) {
	code, err := usecase.userRepository.Delete(id)
	if err != nil {
		return code, err
	}

	return code, nil
}
