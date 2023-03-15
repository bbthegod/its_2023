package controllers

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"its-backend/common"
	"its-backend/model"
	"its-backend/repository"
	"its-backend/types"
	"net/http"
)

func CreateQuestion(c *gin.Context) {
	var question model.Question

	err := common.GetBodyData(c, &question)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return
	}

	question.Id = primitive.NewObjectID()

	result, code, err := repository.CreateQuestion(question)
	if err != nil && code != 0 {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, types.Response{Data: result})
	return
}

func GetQuestion(c *gin.Context) {
	id, err := common.GetIDParam(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return
	}

	result, code, err := repository.FindQuestionOne(bson.M{"_id": id})
	if err != nil && code != 0 {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, types.Response{Data: result})
	return
}

func GetQuestions(c *gin.Context) {
	query, err := common.GetQueries(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return
	}

	result, count, code, err := repository.FindQuestionMany(query.Skip, query.Limit, query.Search)
	if err != nil && code != 0 {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, types.Response{Data: result, Count: count, Limit: query.Limit, Skip: query.Skip})
	return
}

func UpdateQuestion(c *gin.Context) {
	var question model.Question

	id, err := common.GetIDParam(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return
	}

	err = common.GetBodyData(c, &question)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return
	}

	update := bson.M{
		"content":       question.Content,
		"options":       question.Options,
		"correctAnswer": question.CorrectAnswer,
	}

	result, code, err := repository.UpdateQuestion(id, update)
	if err != nil && code != 0 {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, types.Response{Data: result})
	return
}

func DeleteQuestion(c *gin.Context) {
	id, err := common.GetIDParam(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return
	}

	result, code, err := repository.DeleteQuestion(id)
	if err != nil && code != 0 {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, types.Response{Data: result})
	return
}
