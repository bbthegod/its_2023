package router

import (
	"its-backend/controllers"
	"its-backend/middleware"

	"github.com/gin-gonic/gin"
)

func QuestionRoute(router *gin.Engine) {
	questions := router.Group("/api/question")
	questions.Use(middleware.Authentication("admin"))
	{
		questions.GET("", controllers.GetQuestions)
		questions.POST("", controllers.CreateQuestion)
		questions.GET("/:id", controllers.GetQuestion)
		questions.PUT("/:id", controllers.UpdateQuestion)
		questions.DELETE("/:id", controllers.DeleteQuestion)
	}
}
