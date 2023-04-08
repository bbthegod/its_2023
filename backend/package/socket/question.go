package socket

import (
	"context"
	"errors"
	"its-backend/package/domain/model"
	"strconv"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type play struct {
	Id        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Questions []playQuestion     `json:"questions,omitempty" bson:"questions,omitempty"`
	PlayScore int                `json:"playScore" bson:"playScore"`
}

type playQuestion struct {
	Id         primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	QuestionId model.Question     `json:"questionId,omitempty" bson:"questionId,omitempty"`
	Answered   bool               `json:"answered" bson:"answered"`
	Answer     int                `json:"answer" bson:"answer"`
}

func Question(data Response, collections *Collections) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	user, err := Authentication(data.Token, collections)
	if err != nil {
		return err
	}

	var result *play

	cursor, err := collections.Play.Aggregate(ctx, []bson.M{
		{"$match": bson.M{"userId": user.Id}},
		{"$lookup": bson.M{
			"from":         "questions",
			"localField":   "questions.questionId",
			"foreignField": "_id",
			"as":           "questionFullData",
		}},
		{"$set": bson.M{
			"questions": bson.M{
				"$map": bson.M{
					"input": "$questions",
					"in": bson.M{
						"$mergeObjects": bson.A{
							"$$this",
							bson.M{"questionId": bson.M{
								"$arrayElemAt": bson.A{
									"$questionFullData",
									bson.M{
										"$indexOfArray": bson.A{
											"$questionFullData._id",
											"$$this.questionId",
										},
									},
								},
							}},
						},
					},
				},
			},
		}},
	})
	if err != nil {
		return err
	}

	for cursor.Next(ctx) {
		if err := cursor.Decode(&result); err != nil {
			return err
		}
	}

	score := 0
	for index, s := range result.Questions {
		if index == data.Data.Index {
			if data.Data.Answer == s.QuestionId.CorrectAnswer {
				score = score + 5
			}
		} else {
			if s.Answer == s.QuestionId.CorrectAnswer {
				score = score + 5
			}
		}
	}

	updateQuestion := bson.M{
		"questions." + strconv.Itoa(data.Data.Index) + ".answer":   data.Data.Answer,
		"questions." + strconv.Itoa(data.Data.Index) + ".answered": true,
		"playScore": score,
	}

	updated, err := collections.Play.UpdateOne(ctx, bson.M{"userId": user.Id}, bson.M{"$set": updateQuestion})
	if err != nil {
		return err
	}
	if updated.ModifiedCount < 1 {
		return errors.New("update failed")
	}

	return nil
}
