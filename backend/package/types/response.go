package types

import "go.mongodb.org/mongo-driver/bson/primitive"

type Response struct {
    Error    string `json:"error,omitempty"`
    Data    interface{} `json:"data,omitempty"`
    Count    int64 `json:"count,omitempty"`
    Limit    int64 `json:"limit,omitempty"`
    Skip    int64 `json:"skip,omitempty"`
}

type LoginResponse struct {
    Token string `json:"token"`
    User UserInfo `json:"user"`
}

type UserInfo struct {
	Id              primitive.ObjectID `json:"_id,omitempty" bson:"_id"`
    StudentCode     string `json:"studentCode,omitempty"`
    StudentName     string `json:"studentName,omitempty"`
}
