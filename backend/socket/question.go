package socket

import (
	"fmt"
	"its-backend/repository"
)

func Question(data Response) error {
	user, err := Authentication(data.Token)
	if err != nil {
		return err
	}
	fmt.Println(user)
	_, _, err = repository.AnswerPlay(user.Id, data.Data.Index, data.Data.Answer)
	if err != nil {
		return err
	}
	return nil
}
