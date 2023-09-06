package controller

import (
	"its-backend/package/common"
	"its-backend/package/types"
	"its-backend/package/usecase/usecase"
	"net/http"
	"path/filepath"

	"its-backend/package/domain/model"

	"github.com/gin-gonic/gin"
)

type userController struct {
	userUsecase usecase.User
}

type User interface {
	List(c *gin.Context) error
	GetOne(c *gin.Context) error
	Create(c *gin.Context) error
	Update(c *gin.Context) error
	Delete(c *gin.Context) error
	UploadImage(c *gin.Context) error
}

func NewUserController(uu usecase.User) User {
	return &userController{uu}
}

func (controller *userController) List(ctx *gin.Context) error {
	query, err := common.GetQueries(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return err
	}

	var res []*model.User

	res, count, code, err := controller.userUsecase.List(query.Skip, query.Limit, query.Search)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res, Count: count, Limit: query.Limit, Skip: query.Skip})
	return nil
}

func (controller *userController) GetOne(ctx *gin.Context) error {
	id, err := common.GetIDParam(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return nil
	}

	res, code, err := controller.userUsecase.GetOne(id)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res})
	return nil
}

func (controller *userController) Create(ctx *gin.Context) error {
	var params model.UserBodyParams

	err := common.GetBodyParams(ctx, &params)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return err
	}

	user := new(model.User)
	user.StudentCode = params.StudentCode
	user.StudentName = params.StudentName
	user.StudentClass = params.StudentClass
	user.StudentPhone = params.StudentPhone
	user.Password = params.Password

	res, code, err := controller.userUsecase.Create(user)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res})
	return nil
}

func (controller *userController) Update(ctx *gin.Context) error {
	var params model.UserBodyParams

	id, err := common.GetIDParam(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return nil
	}

	err = common.GetBodyParams(ctx, &params)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return err
	}

	user := new(model.User)
	user.StudentCode = params.StudentCode
	user.StudentName = params.StudentName
	user.StudentClass = params.StudentClass
	user.StudentPhone = params.StudentPhone
	user.Password = params.Password

	res, code, err := controller.userUsecase.Update(id, user)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res})
	return nil
}

func (controller *userController) Delete(ctx *gin.Context) error {
	id, err := common.GetIDParam(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return nil
	}

	code, err := controller.userUsecase.Delete(id)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
	}

	ctx.Status(http.StatusOK)
	return nil
}

func (controller *userController) UploadImage(ctx *gin.Context) error {
	id, err := common.GetIDParam(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return nil
	}

	file, err := ctx.FormFile("file")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return nil
	}

	user, code, err := controller.userUsecase.GetOne(id)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
		return nil
	}

	filename := user.StudentCode + filepath.Ext(file.Filename)

	if err := ctx.SaveUploadedFile(file, "./public/"+filename); err != nil {
		ctx.JSON(http.StatusInternalServerError, types.Response{Error: err.Error()})
		return nil
	}

	u := new(model.User)
	u.StudentCode = user.StudentCode
	u.StudentName = user.StudentName
	u.StudentClass = user.StudentClass
	u.StudentPhone = user.StudentPhone
	u.Image = string(filename)

	_, code, err = controller.userUsecase.Update(id, u)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
	}

	ctx.Status(http.StatusOK)
	return nil
}
