package controller

import (
	"its-backend/package/common"
	"its-backend/package/types"
	"its-backend/package/usecase/usecase"
	"net/http"

	"its-backend/package/domain/model"

	"github.com/gin-gonic/gin"
)

type questionController struct {
	questionUsecase usecase.Question
}

type Question interface {
	List(c *gin.Context) error
	GetOne(c *gin.Context) error
	Create(c *gin.Context) error
	Update(c *gin.Context) error
	Delete(c *gin.Context) error
}

func NewQuestionController(uq usecase.Question) Question {
	return &questionController{uq}
}

func (controller *questionController) List(ctx *gin.Context) error {
	query, err := common.GetQueries(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return err
	}

	res, count, code, err := controller.questionUsecase.List(query.Skip, query.Limit, query.Search)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res, Count: count, Limit: query.Limit, Skip: query.Skip})
	return nil
}

func (controller *questionController) GetOne(ctx *gin.Context) error {
	id, err := common.GetIDParam(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return nil
	}

	res, code, err := controller.questionUsecase.GetOne(id)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res})
	return nil
}

func (controller *questionController) Create(ctx *gin.Context) error {
	var params model.QuestionBodyParams

	err := common.GetBodyParams(ctx, &params)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return err
	}

	question := new(model.Question)
	question.Content = params.Content
	question.Options = params.Options
	question.CorrectAnswer = params.CorrectAnswer

	res, code, err := controller.questionUsecase.Create(question)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
		return err
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res})
	return nil
}

func (controller *questionController) Update(ctx *gin.Context) error {
	var params model.QuestionBodyParams

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

	question := new(model.Question)
	question.Content = params.Content
	question.Options = params.Options
	question.CorrectAnswer = params.CorrectAnswer

	res, code, err := controller.questionUsecase.Update(id, question)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
	}

	ctx.JSON(http.StatusOK, types.Response{Data: res})
	return nil
}

func (controller *questionController) Delete(ctx *gin.Context) error {
	id, err := common.GetIDParam(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return nil
	}

	code, err := controller.questionUsecase.Delete(id)
	if err != nil {
		ctx.JSON(code, types.Response{Error: err.Error()})
	}

	ctx.Status(http.StatusOK)
	return nil
}
