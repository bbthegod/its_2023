package repository

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"its-backend/config"
	"its-backend/model"
	"math/rand"
	"net/http"
	"strconv"
	"time"
)

var playQuestionLookup = bson.M{"$lookup": bson.M{
	"from":         "questions",
	"localField":   "questions.questionId",
	"foreignField": "_id",
	"as":           "questionFullData",
}}

var playQuestionSet = bson.M{"$set": bson.M{
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
}}

var playUserLookup = bson.M{"$lookup": bson.M{
	"from":         "users",
	"localField":   "userId",
	"foreignField": "_id",
	"as":           "userId",
}}

var playProjectionAdmin = bson.M{"$project": bson.M{
	"userId":         1,
	"questions":      1,
	"timeOut":        1,
	"playScore":      1,
	"attitudeScore":  1,
	"knowledgeScore": 1,
	"interviewer":    1,
	"comment":        1,
	"isInterviewed":  1,
	"totalScore": bson.M{
		"$sum": bson.A{"$playScore", "$knowledgeScore", "$attitudeScore"},
	},
}}

var playProjectionUser = bson.M{"$project": bson.M{
	"userId.studentCode":           1,
	"userId.studentName":           1,
	"questions.questionId._id":     1,
	"questions.questionId.content": 1,
	"questions.questionId.options": 1,
	"questions.answered":           1,
	"questions.answer":             1,
	"timeOut":                      1,
}}

func FindPlayMany(skip int64, limit int64) ([]model.Play, int64, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := config.GetCollection("plays").Aggregate(ctx, []bson.M{
		{"$limit": limit},
		{"$skip": skip},
		playUserLookup,
		//playUserSet,
		{"$unwind": "$userId"},
		playProjectionAdmin,
	})
	if err != nil {
		return nil, 0, http.StatusInternalServerError, nil
	}

	count, err := config.GetCollection("plays").CountDocuments(ctx, bson.D{})
	if err != nil {
		return nil, 0, http.StatusInternalServerError, nil
	}

	var result []model.Play
	for cursor.Next(ctx) {
		var play model.Play
		if err := cursor.Decode(&play); err != nil {
			return nil, 0, http.StatusInternalServerError, nil
		}
		result = append(result, play)
	}
	return result, count, 0, nil
}

func AnswerPlay(userId primitive.ObjectID, index int, answer int) (*model.Play, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	result := model.Play{}
	updateQuestion := bson.M{
		"questions." + strconv.Itoa(index) + ".answer":   answer,
		"questions." + strconv.Itoa(index) + ".answered": true,
	}
	updated, err := config.GetCollection("plays").UpdateOne(ctx, bson.M{"userId": userId}, bson.M{"$set": updateQuestion})
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}
	if updated.ModifiedCount < 1 {
		return nil, http.StatusInternalServerError, errors.New("update failed")
	}
	return &result, 0, nil
}

func FindPlayOne(otp bson.M) (model.Play, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var result model.Play
	count := 0

	cursor, err := config.GetCollection("plays").Aggregate(ctx, []bson.M{
		{"$match": otp},
		playQuestionLookup,
		playQuestionSet,
		playUserLookup,
		{"$unwind": "$userId"},
		playProjectionAdmin,
	})
	if err != nil {
		return result, http.StatusInternalServerError, err
	}

	for cursor.Next(ctx) {
		if err := cursor.Decode(&result); err != nil {
			return result, http.StatusInternalServerError, err
		}
		count = count + 1
	}

	if count == 0 {
		return result, http.StatusNotFound, errors.New("play not found")
	}
	return result, 0, nil
}

func FindLeaderboard() ([]model.Play, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var result []model.Play
	cursor, err := config.GetCollection("plays").Aggregate(ctx, []bson.M{
		playUserLookup,
		{"$unwind": "$userId"},
		playProjectionAdmin,
		{"$sort": bson.M{"totalScore": -1}},
	})
	if err != nil {
		return result, http.StatusInternalServerError, err
	}

	for cursor.Next(ctx) {
		var play model.Play
		if err := cursor.Decode(&play); err != nil {
			return result, http.StatusInternalServerError, err
		}
		result = append(result, play)
	}

	return result, 0, nil
}

func FindPlayOneForUser(otp bson.M) (model.Play, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var result model.Play
	count := 0
	cursor, err := config.GetCollection("plays").Aggregate(ctx, []bson.M{
		{"$match": otp},
		playQuestionLookup,
		playQuestionSet,
		playUserLookup,
		{"$unwind": "$userId"},
		playProjectionUser,
	})
	if err != nil {
		return result, http.StatusInternalServerError, err
	}

	for cursor.Next(ctx) {
		if err := cursor.Decode(&result); err != nil {
			return result, http.StatusInternalServerError, err
		}
		count += 1
	}

	if count == 0 {
		return result, http.StatusNotFound, errors.New("play not found")
	}

	return result, 0, nil
}

func getRandomQuestion() ([]model.PlayQuestion, error) {
	var result []model.PlayQuestion
	question, _, code, err := FindQuestionMany(0, 9999999, "")
	if err != nil && code != 0 {
		return result, err
	}
	rand.Shuffle(len(question), func(i, j int) { question[i], question[j] = question[j], question[i] })
	if len(question) > 20 {
		question = question[:20]
	}
	for _, s := range question {
		result = append(result, model.PlayQuestion{
			Id:         primitive.NewObjectID(),
			QuestionId: s.Id,
			Answered:   false,
		})
	}
	return result, nil
}

func GetUserPlay(user model.User) (model.Play, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var result model.Play

	count, err := config.GetCollection("plays").CountDocuments(ctx, bson.M{"userId": user.Id})
	if err != nil {
		return result, http.StatusInternalServerError, err
	}

	if count > 0 {
		return result, http.StatusConflict, errors.New("play is exists")
	} else {
		date := time.Now().Add(time.Minute * time.Duration(20))
		question, err := getRandomQuestion()
		if err != nil {
			return result, http.StatusInternalServerError, err
		}
		newPlay := model.Play{
			UserId:         user.Id,
			Questions:      question,
			AttitudeScore:  0,
			KnowledgeScore: 0,
			IsInterviewed:  false,
			TimeOut:        primitive.NewDateTimeFromTime(date),
		}

		np, err := config.GetCollection("plays").InsertOne(ctx, newPlay)
		if err != nil {
			return result, http.StatusInternalServerError, err
		}

		cursor, err := config.GetCollection("plays").Aggregate(ctx, []bson.M{
			{"$match": bson.M{"_id": np.InsertedID}},
			playQuestionLookup,
			playQuestionSet,
			playUserLookup,
			{"$unwind": "$userId"},
			playProjectionUser,
		})
		if err != nil {
			return result, http.StatusInternalServerError, err
		}

		for cursor.Next(ctx) {
			if err := cursor.Decode(&result); err != nil {
				return result, http.StatusInternalServerError, err
			}
		}
	}

	return result, 0, nil
}

func EndUserPlay(user model.User) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var result *mongo.UpdateResult

	date := time.Now()
	updateInfo := bson.M{"$set": bson.M{
		"timeOut": primitive.NewDateTimeFromTime(date),
	}}

	result, err := config.GetCollection("plays").UpdateOne(ctx, bson.M{"userId": user.Id}, updateInfo)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	if result.ModifiedCount == 1 {
		return http.StatusOK, nil
	}

	return http.StatusInternalServerError, err
}

func Interview(play model.Play, id primitive.ObjectID) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var result *mongo.UpdateResult

	updateInfo := bson.M{"$set": bson.M{
		"attitudeScore":  play.AttitudeScore,
		"knowledgeScore": play.KnowledgeScore,
		"comment":        play.Comment,
		"interviewer":    play.Interviewer,
		"isInterviewed":  true,
	}}

	result, err := config.GetCollection("plays").UpdateOne(ctx, bson.M{"_id": id}, updateInfo)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	if result.ModifiedCount == 1 {
		return http.StatusOK, nil
	}

	return http.StatusInternalServerError, err
}

func DeletePlay(id primitive.ObjectID) (*mongo.DeleteResult, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	result, err := config.GetCollection("plays").DeleteOne(ctx, bson.M{"userId": id})
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}
	if result.DeletedCount < 1 {
		return nil, http.StatusInternalServerError, err
	}
	return result, 0, nil
}
