package controllers

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"golang.org/x/crypto/bcrypt"
	"its-backend/common"
	"its-backend/middleware"
	"its-backend/repository"
	"its-backend/types"
	"net/http"
)

type LoginParam struct {
	StudentCode string `json:"studentCode,omitempty" validate:"required"`
	Password    string `json:"password,omitempty" validate:"required"`
}

func Login(c *gin.Context) {
	var auth LoginParam
	err := common.GetBodyData(c, &auth)
	if err != nil {
		c.JSON(http.StatusUnauthorized, types.Response{Error: err.Error()})
		return
	}

	user, code, err := repository.FindUserOne(bson.M{"studentCode": auth.StudentCode})
	if err != nil && code != 0 {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}
	if user.IsOnline {
		c.JSON(http.StatusUnauthorized, types.Response{Error: "User is online!"})
		return
	}

	if user.Role == "admin" {
		err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(auth.Password))
		if err != nil {
			c.JSON(http.StatusUnauthorized, types.Response{Error: "StudentCode or Password incorrect!"})
			return
		}
	} else {
		if user.Password != auth.Password {
			c.JSON(http.StatusUnauthorized, types.Response{Error: "StudentCode or Password incorrect!"})
			return
		}
	}
	token := middleware.EncodeToken(c, user)
	c.JSON(http.StatusAccepted, types.LoginResponse{Token: token, User: types.UserInfo{Id: user.Id, StudentCode: user.StudentCode, StudentName: user.StudentName}})
}

func Check(c *gin.Context) {
	c.Status(http.StatusOK)
}
