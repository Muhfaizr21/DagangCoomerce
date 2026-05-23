package resources

import (
	"time"

	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
)

type UserResource struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
}

type UserWithTokenResource struct {
	User  UserResource `json:"user"`
	Token string       `json:"token"`
}

func ToUserResource(user *models.User) UserResource {
	return UserResource{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
	}
}

func ToUserResourceList(users []models.User) []UserResource {
	list := make([]UserResource, len(users))
	for i, u := range users {
		list[i] = ToUserResource(&u)
	}
	return list
}

func ToUserWithTokenResource(user *models.User, token string) UserWithTokenResource {
	return UserWithTokenResource{
		User:  ToUserResource(user),
		Token: token,
	}
}
