package socket

import (
	"context"
	"errors"
	"its-backend/package/domain/model"
	"its-backend/package/types"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson"
)

func Authentication(token string, collections *Collections) (*model.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	claims := &types.Claims{}

	tkn, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		return nil, err
	}
	if !tkn.Valid {
		return nil, err
	}

	var user *model.User
	err = collections.User.FindOne(ctx, bson.M{"_id": claims.Id}).Decode(&user)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func Entry(data Response, status bool, collections *Collections) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	user, err := Authentication(data.Token, collections)
	if err != nil {
		return err
	}

	updated, err := collections.User.UpdateOne(ctx, bson.M{"_id": user.Id}, bson.M{"$set": bson.M{"isOnline": status}})
	if err != nil {
		return err
	}
	if updated.ModifiedCount < 0 {
		return errors.New("update failed")
	}

	return nil
}
