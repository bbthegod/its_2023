package middleware

import (
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"its-backend/model"
	"its-backend/repository"
	"its-backend/types"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

func extractBearerToken(header string) (string, error) {
	if header == "" {
		return "", errors.New("JWT malformed")
	}

	jwtToken := strings.Split(header, " ")

	if len(jwtToken) != 2 {
		return "", errors.New("JWT malformed")
	}

	return jwtToken[1], nil
}

func Authentication(role string) gin.HandlerFunc {
	return func(c *gin.Context) {
		jwtToken, err := extractBearerToken(c.GetHeader("Authorization"))
		if err != nil {
			c.Status(http.StatusUnauthorized)
			c.Abort()
			return
		}
		claims := &types.Claims{}

		tkn, err := jwt.ParseWithClaims(jwtToken, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})
		if err != nil {
			c.Status(http.StatusUnauthorized)
			c.Abort()
			return
		}
		if !tkn.Valid {
			c.Status(http.StatusUnauthorized)
			c.Abort()
			return
		}

		user, code, err := repository.FindUserOne(bson.M{"_id": claims.Id})
		if err != nil && code != 0 {
			c.Status(http.StatusUnauthorized)
			c.Abort()
			return
		}
		if user.Role == "user" && role != "user" {
			c.Status(http.StatusUnauthorized)
			c.Abort()
			return
		}

		auth := types.Auth{
			Id:          claims.Id.Hex(),
			StudentCode: claims.StudentCode,
			StudentName: claims.StudentName,
		}
		c.Set("auth", auth)
		c.Next()
	}
}

func EncodeToken(c *gin.Context, user model.User) (token string) {
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
