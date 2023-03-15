package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	Id           primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	StudentCode  string             `json:"studentCode,omitempty"`
	StudentName  string             `json:"studentName,omitempty"`
	StudentClass string             `json:"studentClass,omitempty"`
	StudentPhone string             `json:"studentPhone,omitempty"`
	Password     string             `json:"password,omitempty"`
	Image        string             `json:"image,omitempty"`
	Role         string             `json:"role,omitempty"`
	IsOnline     bool               `json:"isOnline,omitempty"`
	Status       int                `json:"status,omitempty"`
}
