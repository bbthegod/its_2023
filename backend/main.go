package main

import (
	"its-backend/config"
	"its-backend/middleware"
	"its-backend/router"
	"its-backend/socket"
	"log"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
)

func main() {
	env := config.GetENV()
	r := gin.Default()

	r.Use(middleware.CORS)
	r.Use(gzip.Gzip(gzip.DefaultCompression))
	r.GET("/", socket.InitSocket)
	router.AppRouter(r)

	log.Printf("\n\n PORT: %s \n ENV: %s \n\n", env.Port, env.Env)
	err := r.Run(":" + env.Port)
	if err != nil {
		log.Printf("Failed to start server!")
	}
}
