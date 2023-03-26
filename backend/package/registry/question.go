package registry

import (
	"its-backend/package/adapter/controller"
	"its-backend/package/adapter/repository"
	"its-backend/package/usecase/usecase"
)

func (r *registry) NewQuestionController() controller.Question {
	usecase := usecase.NewQuestionUsecase(
		repository.NewQuestionRepository(r.db),
	)

	return controller.NewQuestionController(usecase)
}
