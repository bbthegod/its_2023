package middleware

import (
	"errors"
	"its-backend/package/adapter/controller"
	"its-backend/package/types"
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

func Authentication(role string, c controller.AppController) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		jwtToken, err := extractBearerToken(ctx.GetHeader("Authorization"))
		if err != nil {
			ctx.Status(http.StatusUnauthorized)
			ctx.Abort()
			return
		}
		claims := &types.Claims{}

		tkn, err := jwt.ParseWithClaims(jwtToken, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})
		if err != nil {
			ctx.Status(http.StatusUnauthorized)
			ctx.Abort()
			return
		}
		if !tkn.Valid {
			ctx.Status(http.StatusUnauthorized)
			ctx.Abort()
			return
		}

		user, err := c.Auth.GetUser(claims.Id)
		if err != nil {
			ctx.Status(http.StatusUnauthorized)
			ctx.Abort()
			return
		}

		if user.Role == "user" && role != "user" {
			ctx.Status(http.StatusUnauthorized)
			ctx.Abort()
			return
		}

		auth := types.Auth{
			Id:          claims.Id.Hex(),
			StudentCode: claims.StudentCode,
			StudentName: claims.StudentName,
		}
		ctx.Set("auth", auth)

		ctx.Next()
	}
}
