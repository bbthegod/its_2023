package types

import "go.mongodb.org/mongo-driver/bson/primitive"

type Response struct {
	Error string      `json:"error,omitempty"`
	Data  interface{} `json:"data,omitempty"`
	Count int64       `json:"count,omitempty"`
	Limit int64       `json:"limit,omitempty"`
	Skip  int64       `json:"skip,omitempty"`
}

type LoginResponse struct {
	Token string            `json:"token"`
	User  LoginResponseUser `json:"user"`
}

type LoginResponseUser struct {
	Id          primitive.ObjectID `json:"_id" bson:"_id"`
	StudentCode string             `json:"studentCode"`
	StudentName string             `json:"studentName"`
}
