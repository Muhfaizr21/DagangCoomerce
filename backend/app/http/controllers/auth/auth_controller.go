package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/muhfaiizr/dagangcommerce/backend/app/http/requests"
	"github.com/muhfaiizr/dagangcommerce/backend/app/http/resources"
	"github.com/muhfaiizr/dagangcommerce/backend/app/services"
)

type AuthController struct {
	service services.UserService
}

func NewAuthController(service services.UserService) *AuthController {
	return &AuthController{service: service}
}

// Register handles user registration
func (c *AuthController) Register(ctx *gin.Context) {
	var req requests.RegisterRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{
			"message": "Validation failed",
			"errors":  err.Error(),
		})
		return
	}

	user, err := c.service.Register(req.Name, req.Email, req.Password)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
		"data":    resources.ToUserResource(user),
	})
}

// Login handles user login and authentication
func (c *AuthController) Login(ctx *gin.Context) {
	var req requests.LoginRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{
			"message": "Validation failed",
			"errors":  err.Error(),
		})
		return
	}

	token, user, err := c.service.Login(req.Email, req.Password)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"data":    resources.ToUserWithTokenResource(user, token),
	})
}
