package controller

import (
	"its-backend/package/common"
	"its-backend/package/domain/model"
	"its-backend/package/types"
	"its-backend/package/usecase/usecase"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
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
	var auth *model.User
	if err := ctx.Bind(&auth); err != nil {
		ctx.JSON(http.StatusInternalServerError, types.Response{Error: err.Error()})
		return err
	}

	user, _, err := controller.authUsecase.Login(auth)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, types.Response{Error: err.Error()})
		return err
	}
	if user.IsOnline {
		ctx.JSON(http.StatusUnauthorized, types.Response{Error: "User is online!"})
		return err
	}

	if user.Role == "admin" {
		err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(auth.Password))
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, types.Response{Error: "StudentCode or Password incorrect!"})
			return err
		}
	} else {
		if user.Password != auth.Password {
			ctx.JSON(http.StatusUnauthorized, types.Response{Error: "StudentCode or Password incorrect!"})
			return err
		}
	}
	token := common.EncodeToken(ctx, user)
	ctx.JSON(http.StatusAccepted, types.LoginResponse{Token: token, User: types.UserInfo{Id: user.Id, StudentCode: user.StudentCode, StudentName: user.StudentName}})
	return nil
}

func (controller *authController) GetUser(id primitive.ObjectID) (*model.User, error) {
	res, _, err := controller.userUsecase.GetOne(id)
	if err != nil {
		return nil, err
	}

	return res, nil
}
