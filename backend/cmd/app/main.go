package main

import (
	"log"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"

	"its-backend/package/config"
	"its-backend/package/infrastructure/datastore"
	"its-backend/package/infrastructure/middleware"
	"its-backend/package/infrastructure/router"
	"its-backend/package/registry"
	"its-backend/package/socket"
)

func main() {
	env := config.GetENV()

	db := datastore.NewDB()
	r := registry.NewRegistry(db)

	app := gin.Default()
	app.Use(middleware.CORS)
	app.Use(gzip.Gzip(gzip.DefaultCompression))
	router.NewRouter(app, r.NewAppController())
	socket.NewSocket(app, db)

	log.Printf("\n\n PORT: %s \n ENV: %s \n\n", env.Port, env.Env)
	err := app.Run(":" + env.Port)
	if err != nil {
		log.Printf("Failed to start server!")
	}
}
