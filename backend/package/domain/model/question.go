package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Question struct {
	Id            primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Content       string             `json:"content,omitempty"`
	Options       []Options          `json:"options,omitempty"`
	CorrectAnswer int                `json:"correctAnswer,omitempty"`
}

type Options struct {
	Numbering int    `json:"numbering,omitempty"`
	Answer    string `json:"answer,omitempty"`
}

type QuestionBodyParams struct {
	Content       string    `json:"content"`
	Options       []Options `json:"options"`
	CorrectAnswer int       `json:"correctAnswer"`
}
