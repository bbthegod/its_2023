package types

import (
	"github.com/golang-jwt/jwt/v4"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Claims struct {
	Id          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	StudentCode string             `json:"studentCode,omitempty"`
	StudentName string             `json:"studentName,omitempty"`
	jwt.RegisteredClaims
}

type Auth struct {
	Id          string
	StudentCode string
	StudentName string
}
