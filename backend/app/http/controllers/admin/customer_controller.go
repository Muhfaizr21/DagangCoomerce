package admin

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/muhfaiizr/dagangcommerce/backend/app/services"
)

type CustomerController struct {
	service services.CustomerService
}

func NewCustomerController(service services.CustomerService) *CustomerController {
	return &CustomerController{service: service}
}

// Index lists all customers
func (ctrl *CustomerController) Index(c *gin.Context) {
	customers, err := ctrl.service.GetAllCustomers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, customers)
}

// Create handles creating a new customer record
func (ctrl *CustomerController) Create(c *gin.Context) {
	var input struct {
		Name      string `json:"name" binding:"required"`
		Email     string `json:"email" binding:"required,email"`
		Status    string `json:"status" binding:"required"`
		Templates int    `json:"templates"`
		Spend     int64  `json:"spend"`
		Segment   string `json:"segment" binding:"required"`
		Avatar    string `json:"avatar"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	customer, err := ctrl.service.CreateCustomer(
		input.Name,
		input.Email,
		input.Status,
		input.Templates,
		input.Spend,
		input.Segment,
		input.Avatar,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, customer)
}

// Update handles editing a customer record
func (ctrl *CustomerController) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid customer ID"})
		return
	}

	var input struct {
		Name      string `json:"name" binding:"required"`
		Email     string `json:"email" binding:"required,email"`
		Status    string `json:"status" binding:"required"`
		Templates int    `json:"templates"`
		Spend     int64  `json:"spend"`
		Segment   string `json:"segment" binding:"required"`
		Avatar    string `json:"avatar"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	customer, err := ctrl.service.UpdateCustomer(
		uint(id),
		input.Name,
		input.Email,
		input.Status,
		input.Templates,
		input.Spend,
		input.Segment,
		input.Avatar,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, customer)
}

// Delete removes a customer from the database
func (ctrl *CustomerController) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid customer ID"})
		return
	}

	if err := ctrl.service.DeleteCustomer(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Customer deleted successfully"})
}

// ToggleDRMAccess handles customer status and DRM toggles
func (ctrl *CustomerController) ToggleDRMAccess(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid customer ID"})
		return
	}

	customer, err := ctrl.service.ToggleDRMAccess(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, customer)
}

// RecentActivities returns recent active log data
func (ctrl *CustomerController) RecentActivities(c *gin.Context) {
	activities, err := ctrl.service.GetRecentActivities()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, activities)
}
