package common

import (
	"encoding/json"
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"its-backend/types"
	"strconv"
)

var validate = validator.New()

func GetIDParam(c *gin.Context) (primitive.ObjectID, error) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		return id, err
	}
	return id, nil
}

func GetQueries(c *gin.Context) (types.Query, error) {
	query := types.Query{}
	limit, err := strconv.ParseInt(c.DefaultQuery("limit", "500"), 10, 64)
	if err != nil {
		return query, errors.New("limit must be a number")
	}
	skip, err := strconv.ParseInt(c.DefaultQuery("skip", "0"), 10, 64)
	if err != nil {
		return query, errors.New("skip must be a number")
	}
	search := c.DefaultQuery("search", "")
	query.Limit = limit
	query.Skip = skip
	if search != "" {
		query.Search = search
	}
	return query, nil
}

func GetBodyData(c *gin.Context, data interface{}) error {
	body, err := c.GetRawData()
	if err != nil {
		return err
	}
	if err = json.Unmarshal(body, &data); err != nil {
		return err
	}

	if err := validate.Struct(data); err != nil {
		return err
	}

	return nil
}
