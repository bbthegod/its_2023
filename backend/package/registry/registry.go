package registry

import (
	"its-backend/package/adapter/controller"

	"go.mongodb.org/mongo-driver/mongo"
)

type registry struct {
	db *mongo.Client
}

type Registry interface {
	NewAppController() controller.AppController
}

func NewRegistry(db *mongo.Client) Registry {
	return &registry{db}
}

func (r *registry) NewAppController() controller.AppController {
	return controller.AppController{
		User:     r.NewUserController(),
		Auth:     r.NewAuthController(),
		Question: r.NewQuestionController(),
		Play:     r.NewPlayController(),
	}
}
