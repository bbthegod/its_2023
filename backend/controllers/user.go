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

func CreateUser(c *gin.Context) {
	var user model.User

	err := common.GetBodyData(c, &user)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return
	}

	user.Id = primitive.NewObjectID()

	result, code, err := repository.CreateUser(user)
	if err != nil && code != 0 {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, types.Response{Data: result})
	return
}

func GetUser(c *gin.Context) {
	id, err := common.GetIDParam(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return
	}

	result, code, err := repository.FindUserOne(bson.M{"_id": id})
	if err != nil && code != 0 {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, types.Response{Data: result})
	return
}

func GetUsers(c *gin.Context) {
	query, err := common.GetQueries(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return
	}

	result, count, code, err := repository.FindUserMany(query.Skip, query.Limit, query.Search)
	if err != nil && code != 0 {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, types.Response{Data: result, Count: count, Limit: query.Limit, Skip: query.Skip})
	return
}

func UpdateUser(c *gin.Context) {
	var user model.User

	id, err := common.GetIDParam(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return
	}

	err = common.GetBodyData(c, &user)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return
	}

	update := bson.M{
		"studentName":  user.StudentName,
		"studentClass": user.StudentClass,
		"studentPhone": user.StudentPhone,
		"studentCode":  user.StudentCode,
	}

	result, code, err := repository.UpdateUser(id, update)
	if err != nil && code != 0 {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, types.Response{Data: result})
	return
}

func DeleteUser(c *gin.Context) {
	id, err := common.GetIDParam(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, types.Response{Error: err.Error()})
		return
	}

	result, code, err := repository.DeleteUser(id)
	if err != nil && code != 0 {
		c.JSON(code, types.Response{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, types.Response{Data: result})
	return
}
