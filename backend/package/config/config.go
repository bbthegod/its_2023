package config

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gopkg.in/yaml.v3"
)

type EnvConfig struct {
	Env       string
	GinMode   string
	Port      string
	DbURL     string
	DbName    string
	JWTSecret string
}
type Config struct {
	CorrectAnswerScore      int `yaml:"correctAnswerScore"`
	NumberOfEasyQuestions   int `yaml:"numberOfEasyQuestions"`
	NumberOfMediumQuestions int `yaml:"numberOfMediumQuestions"`
	NumberOfHardQuestions   int `yaml:"numberOfHardQuestions"`
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

func GetConfig() *Config {
	config := new(Config)
	yamlFile, err := os.ReadFile("config.yaml")
	if err != nil {
		log.Fatal(err)
		return nil
	}
	err = yaml.Unmarshal(yamlFile, config)
	if err != nil {
		log.Fatal(err)
		return nil
	}
	return config
}
