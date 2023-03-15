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

func CreateQuestion(question model.Question) (*mongo.InsertOneResult, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	result, err := config.GetCollection("questions").InsertOne(ctx, question)
	if err != nil {
		return result, http.StatusInternalServerError, nil
	}
	return result, 0, nil
}

func FindQuestionOne(otp bson.M) (*model.Question, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	result := model.Question{}
	err := config.GetCollection("questions").FindOne(ctx, otp).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, http.StatusNotFound, errors.New("question not found")
		}
		return nil, http.StatusInternalServerError, err
	}
	return &result, 0, nil
}

func FindQuestionMany(skip int64, limit int64, search string) ([]model.Question, int64, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	filter := bson.M{}
	if search != "" {
		filter = bson.M{"content": bson.M{"$regex": search, "$options": "im"}}
	}
	opts := options.Find().SetLimit(limit).SetSkip(skip)
	cursor, err := config.GetCollection("questions").Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, http.StatusInternalServerError, err
	}
	count, err := config.GetCollection("questions").CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, http.StatusInternalServerError, err
	}
	var result []model.Question

	for cursor.Next(ctx) {
		var question model.Question
		if err := cursor.Decode(&question); err != nil {
			return nil, 0, http.StatusInternalServerError, err
		}
		result = append(result, question)
	}
	return result, count, 0, nil
}

func UpdateQuestion(id primitive.ObjectID, updateInfo bson.M) (*model.Question, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	result := model.Question{}
	updated, err := config.GetCollection("questions").UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": updateInfo})
	if updated.MatchedCount == 1 {
		err := config.GetCollection("questions").FindOne(ctx, bson.M{"_id": id}).Decode(&result)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
	}
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}
	return &result, 0, nil
}

func DeleteQuestion(id primitive.ObjectID) (*mongo.DeleteResult, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	result, err := config.GetCollection("questions").DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}
	if result.DeletedCount < 1 {
		return nil, http.StatusInternalServerError, err
	}
	return result, 0, nil
}
