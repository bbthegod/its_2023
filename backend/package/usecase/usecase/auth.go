package usecase

import (
	"its-backend/package/domain/model"
	"its-backend/package/usecase/repository"
	"net/http"
)

type authUsecase struct {
	authRepository repository.AuthRepository
}

type Auth interface {
	Login(user *model.User) (*model.User, string, int, error)
}

func NewAuthUsecase(r repository.AuthRepository) Auth {
	return &authUsecase{r}
}

func (usecase *authUsecase) Login(user *model.User) (*model.User, string, int, error) {
	user, token, code, err := usecase.authRepository.Login(user)
	if err != nil {
		return nil, "", http.StatusInternalServerError, err
	}

	return user, token, code, nil
}
