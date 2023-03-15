package socket

import (
	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson"
	"its-backend/model"
	"its-backend/repository"
	"its-backend/types"
	"os"
)

func Authentication(token string) (model.User, error) {
	claims := &types.Claims{}

	tkn, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		return model.User{}, err
	}
	if !tkn.Valid {
		return model.User{}, err
	}

	user, code, err := repository.FindUserOne(bson.M{"_id": claims.Id})
	if err != nil && code != 0 {
		return model.User{}, err
	}

	return user, nil
}

func Login(data Response) error {
	user, err := Authentication(data.Token)
	if err != nil {
		return err
	}
	_, _, err = repository.UpdateUser(user.Id, bson.M{"isOnline": true})
	if err != nil {
		return err
	}
	return nil
}

func Logout(data Response) error {
	user, err := Authentication(data.Token)
	if err != nil {
		return err
	}
	_, _, err = repository.UpdateUser(user.Id, bson.M{"isOnline": false})
	if err != nil {
		return err
	}
	return nil
}
