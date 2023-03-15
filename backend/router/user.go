package router

import (
	"its-backend/controllers"
	"its-backend/middleware"

	"github.com/gin-gonic/gin"
)

func UserRoute(router *gin.Engine) {
	users := router.Group("/api/user")
	users.Use(middleware.Authentication("admin"))
	{
		users.GET("", controllers.GetUsers)
		users.POST("", controllers.CreateUser)
		users.GET(":id", controllers.GetUser)
		users.PUT(":id", controllers.UpdateUser)
		users.DELETE(":id", controllers.DeleteUser)
	}
}
