package router

import (
	"its-backend/package/adapter/controller"
	"its-backend/package/infrastructure/middleware"

	"github.com/gin-gonic/gin"
)

func QuestionRoute(router *gin.Engine, c controller.AppController) {
	users := router.Group("/api/question")
	users.Use(middleware.Authentication("admin", c))
	{
		users.GET("", func(context *gin.Context) {
			c.Question.List(context)
		})
		users.POST("", func(context *gin.Context) {
			c.Question.Create(context)
		})
		users.GET(":id", func(context *gin.Context) {
			c.Question.GetOne(context)
		})
		users.PUT(":id", func(context *gin.Context) {
			c.Question.Update(context)
		})
		users.DELETE(":id", func(context *gin.Context) {
			c.Question.Delete(context)
		})
	}
}
