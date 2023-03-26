package router

import (
	"its-backend/package/adapter/controller"
	"its-backend/package/infrastructure/middleware"

	"github.com/gin-gonic/gin"
)

func PlayRoute(router *gin.Engine, c controller.AppController) {
	users := router.Group("/api/play")

	users.GET("", middleware.Authentication("admin", c), func(context *gin.Context) {
		c.Play.List(context)
	})
	users.DELETE(":id", middleware.Authentication("admin", c), func(context *gin.Context) {
		c.Play.Delete(context)
	})
	users.GET("user/:id", middleware.Authentication("admin", c), func(context *gin.Context) {
		c.Play.GetUserPlay(context)
	})
	users.GET("leaderboard", middleware.Authentication("admin", c), func(context *gin.Context) {
		c.Play.Leaderboard(context)
	})
	users.POST("interview/:id", middleware.Authentication("admin", c), func(context *gin.Context) {
		c.Play.Interview(context)
	})

	users.GET("get", middleware.Authentication("user", c), func(context *gin.Context) {
		c.Play.GetSingle(context)
	})
	users.GET("start", middleware.Authentication("user", c), func(context *gin.Context) {
		c.Play.StartPlay(context)
	})
	users.GET("end", middleware.Authentication("user", c), func(context *gin.Context) {
		c.Play.EndPlay(context)
	})
}
