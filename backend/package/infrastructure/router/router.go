package router

import (
	"its-backend/package/adapter/controller"

	"github.com/gin-gonic/gin"
)

func NewRouter(e *gin.Engine, c controller.AppController) *gin.Engine {
	AuthRoute(e, c)
	UserRoute(e, c)
	QuestionRoute(e, c)
	PlayRoute(e, c)
	return e
}
