package registry

import (
	"its-backend/package/adapter/controller"
	"its-backend/package/adapter/repository"
	"its-backend/package/usecase/usecase"
)

func (r *registry) NewPlayController() controller.Play {
	usecase := usecase.NewPlayUsecase(
		repository.NewPlayRepository(r.db),
	)

	return controller.NewPlayController(usecase)
}
