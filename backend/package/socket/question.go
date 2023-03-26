package socket

import (
	"context"
	"errors"
	"strconv"
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

func Question(data Response, collections *Collections) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	user, err := Authentication(data.Token, collections)
	if err != nil {
		return err
	}

	updateQuestion := bson.M{
		"questions." + strconv.Itoa(data.Data.Index) + ".answer":   data.Data.Answer,
		"questions." + strconv.Itoa(data.Data.Index) + ".answered": true,
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
