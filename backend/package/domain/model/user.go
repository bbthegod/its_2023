package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	Id           primitive.ObjectID `json:"_id" bson:"_id"`
	StudentCode  string             `json:"studentCode,omitempty"`
	StudentName  string             `json:"studentName,omitempty"`
	StudentClass string             `json:"studentClass,omitempty"`
	StudentPhone string             `json:"studentPhone,omitempty"`
	Password     string             `json:"password,omitempty"`
	Role         string             `json:"role,omitempty"`
	IsOnline     bool               `json:"isOnline" bson:"isOnline"`
}

type UserBodyParams struct {
	StudentCode  string `json:"studentCode"`
	StudentName  string `json:"studentName"`
	StudentClass string `json:"studentClass"`
	StudentPhone string `json:"studentPhone"`
	Password     string `json:"password"`
}
