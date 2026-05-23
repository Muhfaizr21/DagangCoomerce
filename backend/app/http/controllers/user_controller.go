package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/muhfaiizr/dagangcommerce/backend/app/http/resources"
	"github.com/muhfaiizr/dagangcommerce/backend/app/services"
)

type UserController struct {
	service services.UserService
}

func NewUserController(service services.UserService) *UserController {
	return &UserController{service: service}
}

// Profile retrieves the currently authenticated user's profile
func (c *UserController) Profile(ctx *gin.Context) {
	// Retrieve user ID set by auth middleware
	userIDVal, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"message": "Unauthorized context",
		})
		return
	}

	userID, ok := userIDVal.(uint)
	if !ok {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to parse user ID",
		})
		return
	}

	user, err := c.service.GetProfile(userID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": "User profile not found",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": resources.ToUserResource(user),
	})
}

// Index lists all users (Admin/Testing API)
func (c *UserController) Index(ctx *gin.Context) {
	users, err := c.service.GetAllUsers()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": resources.ToUserResourceList(users),
	})
}
