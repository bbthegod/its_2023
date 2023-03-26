package registry

import (
	"its-backend/package/adapter/controller"
	"its-backend/package/adapter/repository"
	"its-backend/package/usecase/usecase"
)

func (r *registry) NewUserController() controller.User {
	usecase := usecase.NewUserUsecase(
		repository.NewUserRepository(r.db),
	)

	return controller.NewUserController(usecase)
}
