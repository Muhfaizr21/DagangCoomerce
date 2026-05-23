package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/muhfaiizr/dagangcommerce/backend/config"
)

// AuthMiddleware intercepts requests and validates the Authorization header with a JWT token
func AuthMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authHeader := ctx.GetHeader("Authorization")
		if authHeader == "" {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "Authorization header is missing",
			})
			ctx.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "Authorization header format must be Bearer <token>",
			})
			ctx.Abort()
			return
		}

		tokenString := parts[1]

		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			// Ensure token signing method is HMAC
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			return []byte(cfg.JWT.Secret), nil
		})

		if err != nil || !token.Valid {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "Invalid or expired authorization token",
				"error":   err.Error(),
			})
			ctx.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "Failed to parse token claims",
			})
			ctx.Abort()
			return
		}

		// Retrieve subject ('sub' field is typically user_id in JWT payload)
		sub, ok := claims["sub"].(float64)
		if !ok {
			ctx.JSON(http.StatusUnauthorized, gin.H{
				"message": "Invalid token subject ID",
			})
			ctx.Abort()
			return
		}

		// Inject user_id into context for subsequent controller handlers to read
		ctx.Set("user_id", uint(sub))
		ctx.Next()
	}
}
