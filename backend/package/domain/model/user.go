package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	Id           primitive.ObjectID `json:"_id" bson:"_id"`
	StudentCode  string             `json:"studentCode,omitempty" bson:"studentCode,omitempty"`
	StudentName  string             `json:"studentName,omitempty" bson:"studentName,omitempty"`
	StudentClass string             `json:"studentClass,omitempty" bson:"studentClass,omitempty"`
	StudentPhone string             `json:"studentPhone,omitempty" bson:"studentPhone,omitempty"`
	Password     string             `json:"password,omitempty" bson:"password,omitempty"`
	Role         string             `json:"role,omitempty" bson:"role,omitempty"`
	Image        string             `json:"image,omitempty" bson:"image,omitempty"`
	IsOnline     bool               `json:"isOnline" bson:"isOnline"`
}

type UserBodyParams struct {
	StudentCode  string `json:"studentCode,omitempty" bson:"studentCode,omitempty"`
	StudentName  string `json:"studentName,omitempty" bson:"studentName,omitempty"`
	StudentClass string `json:"studentClass,omitempty" bson:"studentClass,omitempty"`
	StudentPhone string `json:"studentPhone,omitempty" bson:"studentPhone,omitempty"`
	Password     string `json:"password,omitempty" bson:"password,omitempty"`
}
