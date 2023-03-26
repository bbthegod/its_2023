package registry

import (
	"its-backend/package/adapter/controller"
	"its-backend/package/adapter/repository"
	"its-backend/package/usecase/usecase"
)

func (r *registry) NewAuthController() controller.Auth {
	authUsecase := usecase.NewAuthUsecase(
		repository.NewAuthRepository(r.db),
	)
	userUsecase := usecase.NewUserUsecase(
		repository.NewUserRepository(r.db),
	)

	return controller.NewAuthController(authUsecase, userUsecase)
}
