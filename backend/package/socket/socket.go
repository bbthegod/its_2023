package socket

import (
	"encoding/json"
	"its-backend/package/config"

	"github.com/gin-gonic/gin"
	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"
	"go.mongodb.org/mongo-driver/mongo"
)

type ResponseData struct {
	Index  int `json:"index"`
	Answer int `json:"answer"`
}

type Response struct {
	Type  string       `json:"type"`
	Token string       `json:"token"`
	Data  ResponseData `json:"data"`
}

type Collections struct {
	User *mongo.Collection
	Play *mongo.Collection
}

func InitSocket(ctx *gin.Context, db *mongo.Client) error {
	env := config.GetENV()
	collections := &Collections{
		User: db.Database(env.DbName).Collection("users"),
		Play: db.Database(env.DbName).Collection("plays"),
	}
	conn, _, _, err := ws.UpgradeHTTP(ctx.Request, ctx.Writer)
	if err != nil {
		return err
	}

	go func() {
		defer conn.Close()
		for {
			data, _, err := wsutil.ReadClientData(conn)
			if err != nil {
				println(err.Error())
				return
			}

			err = Routes(data, collections)
			if err != nil {
				println(err.Error())
				return
			}
		}
	}()
	return nil
}

func Routes(res []byte, collections *Collections) error {
	var data Response
	err := json.Unmarshal(res, &data)
	if err != nil {
		return err
	}
	switch data.Type {
	case "login":
		err := Entry(data, true, collections)
		if err != nil {
			return err
		}
	case "disconnect":
		err := Entry(data, false, collections)
		if err != nil {
			return err
		}
	case "question":
		err := Question(data, collections)
		if err != nil {
			return err
		}
	}
	return nil
}

func NewSocket(e *gin.Engine, db *mongo.Client) *gin.Engine {
	e.GET("/", func(context *gin.Context) {
		InitSocket(context, db)
	})
	return e
}
