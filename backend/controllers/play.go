package controllers

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"its-backend/common"
	"its-backend/middleware"
	"its-backend/model"
	"its-backend/repository"
	"its-backend/types"
	"net/http"
)

func GetPlays(c *gin.Context) {
	query, err := common.GetQueries(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return
	}

	result, count, code, err := repository.FindPlayMany(query.Skip, query.Limit)
	if err != nil {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, types.Response{Data: result, Count: count, Limit: query.Limit, Skip: query.Skip})
}

func GetInfo(c *gin.Context) {
	id, err := common.GetIDParam(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return
	}

	result, code, err := repository.FindPlayOne(bson.M{"userId": id})
	if err != nil {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, types.Response{Data: result})
	return
}

func GetLeaderboard(c *gin.Context) {
	result, code, err := repository.FindLeaderboard()
	if err != nil {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, types.Response{Data: result})
}

func GetSingle(c *gin.Context) {
	auth := middleware.GetAuth(c)

	result, code, err := repository.FindPlayOneForUser(bson.M{"userId": auth.Id})
	if err != nil && code != 0 {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, types.Response{Data: result})
}

func StartPlay(c *gin.Context) {
	auth := middleware.GetAuth(c)

	user, code, err := repository.FindUserOne(bson.M{"_id": auth.Id})
	if err != nil && code != 0 {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}

	play, code, err := repository.GetUserPlay(user)
	if err != nil && code != 0 {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, types.Response{Data: play})
	return
}

func EndPlay(c *gin.Context) {
	auth := middleware.GetAuth(c)

	user, code, err := repository.FindUserOne(bson.M{"_id": auth.Id})
	if err != nil && code != 0 {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}

	code, err = repository.EndUserPlay(user)
	if err != nil && code != 0 {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}

	c.Status(http.StatusOK)
	return
}

func Interview(c *gin.Context) {
	var play model.Play

	id, err := common.GetIDParam(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return
	}

	err = common.GetBodyData(c, &play)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return
	}

	code, err := repository.Interview(play, id)
	if err != nil {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}

	c.Status(http.StatusOK)
	return
}

func DeletePlay(c *gin.Context) {
	id, err := common.GetIDParam(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return
	}

	result, code, err := repository.DeletePlay(id)
	if err != nil && code != 0 {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, types.Response{Data: result})
	return
}
