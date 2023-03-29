package repository

import (
	"context"
	"errors"
	"its-backend/package/config"
	"its-backend/package/domain/model"
	"its-backend/package/usecase/repository"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type authRepository struct {
	userCollection *mongo.Collection
}

func NewAuthRepository(db *mongo.Client) repository.AuthRepository {
	env := config.GetENV()
	return &authRepository{db.Database(env.DbName).Collection("users")}
}

func (repository *authRepository) Login(auth *model.User) (*model.User, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user *model.User
	err := repository.userCollection.FindOne(ctx, bson.M{"studentCode": auth.StudentCode}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, http.StatusUnauthorized, errors.New("user not found")
		}
		return nil, http.StatusInternalServerError, err
	}
	if user.IsOnline {
		return nil, http.StatusUnauthorized, errors.New("user is online")
	}

	if user.Role == "admin" {
		err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(auth.Password))
		if err != nil {
			return nil, http.StatusUnauthorized, errors.New("studentCode or Password incorrect")
		}
	} else {
		if user.Password != auth.Password {
			return nil, http.StatusUnauthorized, errors.New("studentCode or Password incorrect")
		}
	}

	return user, http.StatusOK, nil
}