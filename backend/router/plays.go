package router

import (
	"github.com/gin-gonic/gin"
	"its-backend/controllers"
	"its-backend/middleware"
)

func PlayRoute(router *gin.Engine) {
	users := router.Group("/api/play")
	users.GET("", middleware.Authentication("admin"), controllers.GetPlays)
	users.DELETE("/:id", middleware.Authentication("admin"), controllers.DeletePlay)
	users.GET("/user/:id", middleware.Authentication("admin"), controllers.GetInfo)
	users.GET("/leaderboard", middleware.Authentication("admin"), controllers.GetLeaderboard)
	users.POST("/interview/:id", middleware.Authentication("admin"), controllers.Interview)

	users.GET("/get", middleware.Authentication("user"), controllers.GetSingle)
	users.GET("/start", middleware.Authentication("user"), controllers.StartPlay)
	users.GET("/end", middleware.Authentication("user"), controllers.EndPlay)
}
