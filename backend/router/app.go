package router

import (
	"github.com/gin-gonic/gin"
)

func AppRouter(router *gin.Engine) {
	router.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})
	UserRoute(router)
	QuestionRoute(router)
	PlayRoute(router)
	AuthRoute(router)
	router.NoRoute(func(c *gin.Context) {
		c.Status(404)
	})
}
