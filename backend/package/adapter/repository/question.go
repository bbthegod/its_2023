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
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type questionRepository struct {
	questionCollection *mongo.Collection
}

func NewQuestionRepository(db *mongo.Client) repository.QuestionRepository {
	env := config.GetENV()
	collection := db.Database(env.DbName).Collection("questions")
	_, err := collection.Indexes().CreateOne(context.TODO(), mongo.IndexModel{
		Keys:    bson.M{"studentCode": 1},
		Options: options.Index().SetUnique(true),
	})
	if err != nil {
		code := err.(mongo.CommandError).Code
		if code != 11000 {
			panic(err)
		}
	}
	return &questionRepository{collection}
}

func (repository *questionRepository) List(skip int64, limit int64, search string) ([]*model.Question, int64, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{}
	if search != "" {
		filter = bson.M{"content": bson.M{"$regex": search, "$options": "im"}}
	}
	opts := options.Find().SetLimit(limit).SetSkip(skip)
	cursor, err := repository.questionCollection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, http.StatusInternalServerError, err
	}
	count, err := repository.questionCollection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, http.StatusInternalServerError, err
	}
	var result []*model.Question

	for cursor.Next(ctx) {
		var question *model.Question
		if err := cursor.Decode(&question); err != nil {
			return nil, 0, http.StatusInternalServerError, err
		}
		result = append(result, question)
	}
	return result, count, 0, nil
}

func (repository *questionRepository) GetOne(id primitive.ObjectID) (*model.Question, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var result *model.Question
	err := repository.questionCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&result)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	return result, http.StatusOK, nil
}

func (repository *questionRepository) Create(question *model.Question) (*model.Question, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	question.Id = primitive.NewObjectID()

	_, err := repository.questionCollection.InsertOne(ctx, question)
	if err != nil {
		code := err.(mongo.CommandError).Code
		if code == 11000 {
			return nil, http.StatusConflict, errors.New("question is already exists")
		}
		return nil, http.StatusInternalServerError, err
	}

	return question, http.StatusOK, nil
}

func (repository *questionRepository) Update(id primitive.ObjectID, question *model.Question) (*model.Question, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	update := bson.M{
		"content":       question.Content,
		"options":       question.Options,
		"correctAnswer": question.CorrectAnswer,
	}

	var result *model.Question
	updated, err := repository.questionCollection.UpdateOne(ctx, bson.M{"_id": id}, bson.M{"$set": update})
	if updated.MatchedCount == 1 {
		err := repository.questionCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&result)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
	}
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}
	return result, http.StatusOK, nil
}

func (repository *questionRepository) Delete(id primitive.ObjectID) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	deleted, err := repository.questionCollection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return http.StatusInternalServerError, err
	}
	if deleted.DeletedCount != 1 {
		return http.StatusInternalServerError, errors.New("deleted failed")
	}
	return http.StatusOK, nil
}
