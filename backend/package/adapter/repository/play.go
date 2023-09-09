package repository

import (
	"context"
	"errors"
	"its-backend/package/config"
	"its-backend/package/domain/model"
	"its-backend/package/usecase/repository"
	"math/rand"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type playRepository struct {
	playCollection     *mongo.Collection
	questionCollection *mongo.Collection
}

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
	"userId._id":          1,
	"userId.studentCode":  1,
	"userId.studentName":  1,
	"userId.studentPhone": 1,
	"userId.studentClass": 1,
	"userId.image":        1,
	"questions":           1,
	"timeOut":             1,
	"playScore":           1,
	"attitudeScore":       1,
	"knowledgeScore":      1,
	"interviewer":         1,
	"comment":             1,
	"isInterviewed":       1,
	"totalScore": bson.M{
		"$sum": bson.A{"$playScore", "$knowledgeScore", "$attitudeScore"},
	},
}}

var playProjectionUser = bson.M{"$project": bson.M{
	"userId.image":                 1,
	"userId.studentCode":           1,
	"userId.studentName":           1,
	"questions.questionId._id":     1,
	"questions.questionId.content": 1,
	"questions.questionId.options": 1,
	"questions.answered":           1,
	"questions.answer":             1,
	"timeOut":                      1,
}}

func NewPlayRepository(db *mongo.Client) repository.PlayRepository {
	env := config.GetENV()
	collection := db.Database(env.DbName).Collection("plays")
	_, err := collection.Indexes().CreateOne(context.TODO(), mongo.IndexModel{
		Keys:    bson.M{"userId": 1},
		Options: options.Index().SetUnique(true),
	})
	if err != nil {
		panic(err)
	}
	return &playRepository{collection, db.Database(env.DbName).Collection("questions")}
}

func (repository *playRepository) List(skip int64, limit int64) ([]*model.Play, int64, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"userId.role": "user"}

	cursor, err := repository.playCollection.Aggregate(ctx, []bson.M{
		{"$limit": limit},
		{"$skip": skip},
		playUserLookup,
		{"$unwind": "$userId"},
		{"$match": filter},
		playProjectionAdmin,
	})
	if err != nil {
		return nil, 0, http.StatusInternalServerError, nil
	}

	count, err := repository.playCollection.CountDocuments(ctx, bson.D{})
	if err != nil {
		return nil, 0, http.StatusInternalServerError, nil
	}

	var result []*model.Play

	for cursor.Next(ctx) {
		var play *model.Play
		if err := cursor.Decode(&play); err != nil {
			return nil, 0, http.StatusInternalServerError, err
		}
		result = append(result, play)
	}
	return result, count, 0, nil
}

func (repository *playRepository) GetUserPlay(id primitive.ObjectID) (*model.Play, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var result *model.Play
	count := 0

	cursor, err := repository.playCollection.Aggregate(ctx, []bson.M{
		{"$match": bson.M{"userId": id}},
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
		return result, http.StatusOK, errors.New("play not found")
	}
	return result, 0, nil
}

func (repository *playRepository) Leaderboard() ([]*model.Play, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	filter := bson.M{"userId.role": "user"}

	cursor, err := repository.playCollection.Aggregate(ctx, []bson.M{
		playUserLookup,
		{"$unwind": "$userId"},
		{"$match": filter},
		playProjectionAdmin,
		{"$sort": bson.M{"totalScore": -1}},
	})
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	var result []*model.Play

	for cursor.Next(ctx) {
		var play *model.Play
		if err := cursor.Decode(&play); err != nil {
			return nil, http.StatusInternalServerError, err
		}
		result = append(result, play)
	}
	return result, 0, nil
}

func (repository *playRepository) Interview(id primitive.ObjectID, play *model.Play) (int, error) {
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

	result, err := repository.playCollection.UpdateOne(ctx, bson.M{"_id": id}, updateInfo)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	if result.ModifiedCount == 1 {
		return http.StatusOK, nil
	}

	return http.StatusInternalServerError, err
}

func (repository *playRepository) Delete(id primitive.ObjectID) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	deleted, err := repository.playCollection.DeleteOne(ctx, bson.M{"userId": id})
	if err != nil {
		return http.StatusInternalServerError, err
	}
	if deleted.DeletedCount != 1 {
		return http.StatusInternalServerError, errors.New("deleted failed")
	}
	return http.StatusOK, nil
}

func (repository *playRepository) GetSingle(id primitive.ObjectID) (*model.Play, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var result *model.Play
	count := 0
	cursor, err := repository.playCollection.Aggregate(ctx, []bson.M{
		{"$match": bson.M{"userId": id}},
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
		return result, http.StatusOK, errors.New("play not found")
	}

	return result, 0, nil
}

func getRandomQuestion(repository *playRepository) ([]model.PlayQuestion, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	conf := config.GetConfig()

	var result []model.PlayQuestion

	var easyQuestions []*model.Question
	var mediumQuestions []*model.Question
	var hardQuestions []*model.Question

	cursor, err := repository.questionCollection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}

	for cursor.Next(ctx) {
		var question *model.Question
		if err := cursor.Decode(&question); err != nil {
			return nil, err
		}
		if question.Level == "easy" {
			easyQuestions = append(easyQuestions, question)
		}
		if question.Level == "medium" {
			mediumQuestions = append(mediumQuestions, question)
		}
		if question.Level == "hard" {
			hardQuestions = append(hardQuestions, question)
		}
	}

	rand.Shuffle(len(easyQuestions), func(i, j int) { easyQuestions[i], easyQuestions[j] = easyQuestions[j], easyQuestions[i] })
	if len(easyQuestions) > conf.NumberOfEasyQuestions {
		easyQuestions = easyQuestions[:conf.NumberOfEasyQuestions]
	}

	rand.Shuffle(len(mediumQuestions), func(i, j int) { mediumQuestions[i], mediumQuestions[j] = mediumQuestions[j], mediumQuestions[i] })
	if len(mediumQuestions) > conf.NumberOfMediumQuestions {
		mediumQuestions = mediumQuestions[:conf.NumberOfMediumQuestions]
	}

	rand.Shuffle(len(hardQuestions), func(i, j int) { hardQuestions[i], hardQuestions[j] = hardQuestions[j], hardQuestions[i] })
	if len(hardQuestions) > conf.NumberOfHardQuestions {
		hardQuestions = hardQuestions[:conf.NumberOfHardQuestions]
	}

	for _, s := range easyQuestions {
		result = append(result, model.PlayQuestion{
			Id:         primitive.NewObjectID(),
			QuestionId: s.Id,
			Answered:   false,
		})
	}
	for _, s := range mediumQuestions {
		result = append(result, model.PlayQuestion{
			Id:         primitive.NewObjectID(),
			QuestionId: s.Id,
			Answered:   false,
		})
	}
	for _, s := range hardQuestions {
		result = append(result, model.PlayQuestion{
			Id:         primitive.NewObjectID(),
			QuestionId: s.Id,
			Answered:   false,
		})
	}
	return result, nil
}

func (repository *playRepository) StartPlay(id primitive.ObjectID) (*model.Play, int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var result *model.Play

	count, err := repository.playCollection.CountDocuments(ctx, bson.M{"userId": id})
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	if count > 0 {
		return nil, http.StatusConflict, errors.New("play is exists")
	} else {
		date := time.Now().Add(time.Minute * time.Duration(20))
		question, err := getRandomQuestion(repository)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}
		newPlay := model.Play{
			UserId:         id,
			Questions:      question,
			AttitudeScore:  0,
			KnowledgeScore: 0,
			IsInterviewed:  false,
			TimeOut:        primitive.NewDateTimeFromTime(date),
		}

		np, err := repository.playCollection.InsertOne(ctx, newPlay)
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}

		cursor, err := repository.playCollection.Aggregate(ctx, []bson.M{
			{"$match": bson.M{"_id": np.InsertedID}},
			playQuestionLookup,
			playQuestionSet,
			playUserLookup,
			{"$unwind": "$userId"},
			playProjectionUser,
		})
		if err != nil {
			return nil, http.StatusInternalServerError, err
		}

		for cursor.Next(ctx) {
			if err := cursor.Decode(&result); err != nil {
				return nil, http.StatusInternalServerError, err
			}
		}
	}

	return result, 0, nil
}

func (repository *playRepository) EndPlay(id primitive.ObjectID) (int, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var result *mongo.UpdateResult

	date := time.Now()
	updateInfo := bson.M{"$set": bson.M{
		"timeOut": primitive.NewDateTimeFromTime(date),
	}}

	result, err := repository.playCollection.UpdateOne(ctx, bson.M{"userId": id}, updateInfo)
	if err != nil {
		return http.StatusInternalServerError, err
	}

	if result.ModifiedCount == 1 {
		return http.StatusOK, nil
	}

	return http.StatusInternalServerError, err
}
