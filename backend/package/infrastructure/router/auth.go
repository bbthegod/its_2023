package router

import (
	"its-backend/package/adapter/controller"

	"github.com/gin-gonic/gin"
)

func AuthRoute(router *gin.Engine, c controller.AppController) {
	auth := router.Group("/api/auth")
	auth.POST("login", func(context *gin.Context) {
		c.Auth.Login(context)
	})
}
