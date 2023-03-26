package datastore

import (
	"context"
	"fmt"
	"log"
	"reflect"
	"time"

	"its-backend/package/config"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/bsontype"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func NewDB() *mongo.Client {
	env := config.GetENV()
	tM := reflect.TypeOf(bson.M{})
	reg := bson.NewRegistryBuilder().RegisterTypeMapEntry(bsontype.EmbeddedDocument, tM).Build()
	client, err := mongo.NewClient(options.Client().ApplyURI(env.DbURL).SetRegistry(reg))
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancelTimeout := context.WithTimeout(context.Background(), 10*time.Second)

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	//ping the database
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected to MongoDB")
	cancelTimeout()
	return client
}
