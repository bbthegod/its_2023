package controller

import (
	"its-backend/package/common"
	"its-backend/package/types"
	"its-backend/package/usecase/usecase"
	"net/http"

	"its-backend/package/domain/model"

	"github.com/gin-gonic/gin"
)

type playController struct {
	playUsecase usecase.Play
}

type Play interface {
	List(c *gin.Context) error
	GetUserPlay(c *gin.Context) error
	Leaderboard(c *gin.Context) error
	Interview(c *gin.Context) error
	Delete(c *gin.Context) error

	GetSingle(c *gin.Context) error
	StartPlay(c *gin.Context) error
	EndPlay(c *gin.Context) error
}

func NewPlayController(up usecase.Play) Play {
	return &playController{up}
}

func (controller *playController) List(ctx *gin.Context) error {
	query, err := common.GetQueries(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return err
	}

	var res []*model.Play

	res, count, code, err := controller.playUsecase.List(query.Skip, query.Limit)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res, Count: count, Limit: query.Limit, Skip: query.Skip})
	return nil
}

func (controller *playController) GetUserPlay(ctx *gin.Context) error {
	id, err := common.GetIDParam(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return nil
	}

	res, code, err := controller.playUsecase.GetUserPlay(id)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res})
	return nil
}

func (controller *playController) Leaderboard(ctx *gin.Context) error {
	result, code, err := controller.playUsecase.Leaderboard()
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.JSON(http.StatusOK, types.Response{Data: result})
	return nil
}

func (controller *playController) Interview(ctx *gin.Context) error {
	var params model.Play

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

	code, err := controller.playUsecase.Interview(id, &params)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
	}

	ctx.Status(http.StatusOK)
	return nil
}

func (controller *playController) Delete(ctx *gin.Context) error {
	id, err := common.GetIDParam(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return nil
	}

	code, err := controller.playUsecase.Delete(id)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
	}

	ctx.Status(http.StatusOK)
	return nil
}

func (controller *playController) GetSingle(ctx *gin.Context) error {
	auth := common.GetAuth(ctx)

	res, code, err := controller.playUsecase.GetSingle(auth.Id)
	if err != nil && code != 0 {
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res})
	return nil
}

func (controller *playController) StartPlay(ctx *gin.Context) error {
	auth := common.GetAuth(ctx)

	res, code, err := controller.playUsecase.StartPlay(auth.Id)
	if err != nil && code != 0 {
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res})
	return nil
}
func (controller *playController) EndPlay(ctx *gin.Context) error {
	auth := common.GetAuth(ctx)

	code, err := controller.playUsecase.EndPlay(auth.Id)
	if err != nil && code != 0 {
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.Status(http.StatusOK)
	return nil
}
