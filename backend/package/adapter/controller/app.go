package controller

type AppController struct {
	Auth     interface{ Auth }
	User     interface{ User }
	Question interface{ Question }
	Play     interface{ Play }
}
