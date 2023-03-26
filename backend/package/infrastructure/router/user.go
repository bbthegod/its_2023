package router

import (
	"its-backend/package/adapter/controller"
	"its-backend/package/infrastructure/middleware"

	"github.com/gin-gonic/gin"
)

func UserRoute(router *gin.Engine, c controller.AppController) {
	users := router.Group("/api/user")
	users.Use(middleware.Authentication("admin", c))
	{
		users.GET("", func(context *gin.Context) {
			c.User.List(context)
		})
		users.POST("", func(context *gin.Context) {
			c.User.Create(context)
		})
		users.GET(":id", func(context *gin.Context) {
			c.User.GetOne(context)
		})
		users.PUT(":id", func(context *gin.Context) {
			c.User.Update(context)
		})
		users.DELETE(":id", func(context *gin.Context) {
			c.User.Delete(context)
		})
	}
}
