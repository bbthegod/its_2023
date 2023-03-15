package config

import (
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"log"
	"os"
)

type EnvConfig struct {
	Env       string
	GinMode   string
	Port      string
	DbURL     string
	DbName    string
	JWTSecret string
}

func GetENV() *EnvConfig {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Failed to load the env file")
	}
	ec := new(EnvConfig)
	ec.Env = os.Getenv("ENV")
	ec.GinMode = os.Getenv("GIN_MODE")
	ec.Port = os.Getenv("PORT")
	ec.DbURL = os.Getenv("DB_URL")
	ec.DbName = os.Getenv("DB_NAME")
	ec.JWTSecret = os.Getenv("JWT_SECRET")
	gin.SetMode(ec.GinMode)
	return ec
}
