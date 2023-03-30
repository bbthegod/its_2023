package controller

import (
	"its-backend/package/domain/model"
	"its-backend/package/types"
	"its-backend/package/usecase/usecase"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type authController struct {
	authUsecase usecase.Auth
	userUsecase usecase.User
}

type Auth interface {
	Login(c *gin.Context) error
	GetUser(id primitive.ObjectID) (*model.User, error)
}

func NewAuthController(ua usecase.Auth, uu usecase.User) Auth {
	return &authController{ua, uu}
}

func (controller *authController) Login(ctx *gin.Context) error {
	var user *model.User
	if err := ctx.Bind(&user); err != nil {
		ctx.JSON(http.StatusInternalServerError, types.Response{Error: err.Error()})
		return err
	}

	user, token, code, err := controller.authUsecase.Login(user)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.JSON(http.StatusAccepted, types.LoginResponse{Token: token, User: types.LoginResponseUser{Id: user.Id, StudentCode: user.StudentCode, StudentName: user.StudentName}})
	return nil
}

func (controller *authController) GetUser(id primitive.ObjectID) (*model.User, error) {
	res, _, err := controller.userUsecase.GetOne(id)
	if err != nil {
		return nil, err
	}

	return res, nil
}
