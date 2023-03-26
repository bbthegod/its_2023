package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Play struct {
	Id             primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	UserId         interface{}        `json:"userId,omitempty" bson:"userId,omitempty"`
	Questions      []PlayQuestion     `json:"questions,omitempty" bson:"questions,omitempty"`
	TimeOut        primitive.DateTime `json:"timeOut" bson:"timeOut"`
	PlayScore      int                `json:"playScore" bson:"playScore"`
	AttitudeScore  int                `json:"attitudeScore" bson:"attitudeScore"`
	KnowledgeScore int                `json:"knowledgeScore" bson:"knowledgeScore"`
	TotalScore     int                `json:"totalScore" bson:"totalScore"`
	Interviewer    string             `json:"interviewer" bson:"interviewer"`
	Comment        string             `json:"comment" bson:"comment"`
	IsInterviewed  bool               `json:"isInterviewed" bson:"isInterviewed"`
}

type PlayQuestion struct {
	Id         primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	QuestionId interface{}        `json:"questionId,omitempty" bson:"questionId,omitempty"`
	Answered   bool               `json:"answered" bson:"answered"`
	Answer     int                `json:"answer" bson:"answer"`
}
