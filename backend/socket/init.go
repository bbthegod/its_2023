package socket

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"
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

func InitSocket(c *gin.Context) {
	conn, _, _, err := ws.UpgradeHTTP(c.Request, c.Writer)
	if err != nil {
		println(err.Error())
		return
	}

	go func() {
		defer conn.Close()
		for {
			data, _, err := wsutil.ReadClientData(conn)
			if err != nil {
				println(err.Error())
				return
			}
			
			err = Routes(data)
			if err != nil {
				println(err.Error())
				return
			}
		}
	}()
}

func Routes(res []byte) error {
	var data Response
	err := json.Unmarshal(res, &data)
	if err != nil {
		fmt.Println(err)
	}
	switch data.Type {
	case "login":
		err := Login(data)
		if err != nil {
			return err
		}
	case "disconnect":
		err := Logout(data)
		if err != nil {
			return err
		}
	case "question":
		err := Question(data)
		if err != nil {
			return err
		}
	}
	return nil
}
