package model

type Auth struct {
	StudentCode string `json:"studentCode" bson:"studentCode" validate:"required"`
	Password    string `json:"password" bson:"password" validate:"required"`
}
