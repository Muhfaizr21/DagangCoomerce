package admin

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/muhfaiizr/dagangcommerce/backend/app/repositories"
	"github.com/muhfaiizr/dagangcommerce/backend/config"
)

type AuthController struct {
	userRepo repositories.UserRepository
	cfg      *config.Config
}

func NewAuthController(userRepo repositories.UserRepository, cfg *config.Config) *AuthController {
	return &AuthController{userRepo: userRepo, cfg: cfg}
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

func (ctrl *AuthController) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format input tidak valid"})
		return
	}

	user, err := ctrl.userRepo.FindByEmail(req.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email atau kata sandi salah"})
		return
	}

	// Pastikan user memiliki hak akses administratif
	if user.Role != "superadmin" && user.Role != "admin" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Akses ditolak. Memerlukan hak akses Super Admin."})
		return
	}

	if !user.CheckPassword(req.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email atau kata sandi salah"})
		return
	}

	// Generate JWT token secara mandiri menggunakan modul jwt/v5 yang terpasang
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * time.Duration(ctrl.cfg.JWT.ExpireHours)).Unix(),
	})

	tokenString, err := token.SignedString([]byte(ctrl.cfg.JWT.Secret))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghasilkan token autentikasi"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login admin berhasil",
		"token":   tokenString,
		"user": gin.H{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}
