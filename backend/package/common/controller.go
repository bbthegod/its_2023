package common

import (
	"encoding/json"
	"errors"
	"its-backend/package/domain/model"
	"its-backend/package/types"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

func GetBodyParams(c *gin.Context, data interface{}) error {
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

func EncodeToken(c *gin.Context, user *model.User) (token string) {
	claims := &types.Claims{
		Id:               user.Id,
		StudentCode:      user.StudentCode,
		StudentName:      user.StudentName,
		RegisteredClaims: jwt.RegisteredClaims{},
	}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	token, err := t.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.Response{Error: err.Error()})
		c.Abort()
	}
	return token
}

func GetAuth(c *gin.Context) (result types.Claims) {
	var d types.Auth
	if val, ok := c.Get("auth"); ok && val != nil {
		d, _ = val.(types.Auth)
	}
	id, err := primitive.ObjectIDFromHex(d.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, types.Response{Error: err.Error()})
		c.Abort()
	}
	result.Id = id
	result.StudentCode = d.StudentCode
	result.StudentName = d.StudentName
	return result
}
