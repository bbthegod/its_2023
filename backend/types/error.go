package types

import "fmt"

type QueryError struct {
	Code    int
	Message string
}

func (e *QueryError) Error() string {
	return fmt.Sprintf(e.Message)
}
