package common

import (
	"time"
)

func GetCurrentTime(offset time.Duration) (time.Time, error) {
	date := time.Now().Add(offset)
	location, err := time.LoadLocation("Asia/Ho_Chi_Minh")
	if err != nil {
		return date.In(location), err
	}
	return date.In(location), nil
}
