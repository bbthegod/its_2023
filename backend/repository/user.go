package repository

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"its-backend/config"
	"its-backend/model"
	"net/http"
	"time"
)

func CreateUser(user model.User) (*mongo.InsertOneResult, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	result, err := config.GetCollection("users").InsertOne(ctx, user)
	if err != nil {
		return result, http.StatusInternalServerError, nil
	}
	return result, 0, nil
}

func FindUserOne(otp bson.M) (model.User, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	result := model.User{}
	err := config.GetCollection("users").FindOne(ctx, otp).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return result, http.StatusNotFound, errors.New("user not found")
		}
		return result, http.StatusInternalServerError, err
	}
	return result, 0, nil
}

func FindUserMany(skip int64, limit int64, search string) ([]model.User, int64, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	filter := bson.M{}
	if search != "" {
		filter = bson.M{"studentCode": bson.M{"$regex": search, "$options": "im"}}
	}
	opts := options.Find().SetLimit(limit).SetSkip(skip)
	cursor, err := config.GetCollection("users").Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, http.StatusInternalServerError, err
	}
	count, err := config.GetCollection("users").CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, http.StatusInternalServerError, err
	}
	var result []model.User

	for cursor.Next(ctx) {
		var user model.User
		if err := cursor.Decode(&user); err != nil {
			return nil, 0, http.StatusInternalServerError, err
		}
		result = append(result, user)
	}
	return result, count, 0, nil
}

func UpdateUser(id primitive.ObjectID, updateInfo bson.M) (*model.User, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	result := model.User{}
	updated, err := config.GetCollection("users").UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": updateInfo})
	if updated.MatchedCount == 1 {
		err := config.GetCollection("users").FindOne(ctx, bson.M{"_id": id}).Decode(&result)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
	}
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}
	return &result, 0, nil
}

func DeleteUser(id primitive.ObjectID) (*mongo.DeleteResult, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	result, err := config.GetCollection("users").DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}
	if result.DeletedCount < 1 {
		return nil, http.StatusInternalServerError, err
	}
	return result, 0, nil
}
