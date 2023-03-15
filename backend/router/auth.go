package router

import (
	"github.com/gin-gonic/gin"
	"its-backend/controllers"
	"its-backend/middleware"
)

func AuthRoute(router *gin.Engine) {
	auth := router.Group("/api/auth")
	auth.POST("/login", controllers.Login)
	auth.GET("/check", middleware.Authentication("user"), controllers.Check)
}
