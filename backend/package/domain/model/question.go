package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Question struct {
	Id            primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Content       string             `json:"content,omitempty" bson:"content,omitempty"`
	Options       []Options          `json:"options,omitempty" bson:"options,omitempty"`
	CorrectAnswer int                `json:"correctAnswer,omitempty" bson:"correctAnswer,omitempty"`
	Level         string             `json:"level,omitempty" bson:"level,omitempty"`
}

type Options struct {
	Numbering int    `json:"numbering,omitempty" bson:"numbering,omitempty"`
	Answer    string `json:"answer,omitempty" bson:"answer,omitempty"`
}

type QuestionBodyParams struct {
	Content       string    `json:"content" bson:"content,omitempty"`
	Options       []Options `json:"options" bson:"options,omitempty"`
	CorrectAnswer int       `json:"correctAnswer" bson:"correctAnswer,omitempty"`
	Level         string    `json:"level" bson:"level,omitempty"`
}
