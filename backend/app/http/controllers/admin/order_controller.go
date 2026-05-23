package admin

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/muhfaiizr/dagangcommerce/backend/app/services"
)

type OrderController struct {
	orderService   services.OrderService
	projectService services.ProjectService
}

func NewOrderController(orderService services.OrderService, projectService services.ProjectService) *OrderController {
	return &OrderController{
		orderService:   orderService,
		projectService: projectService,
	}
}

// Index lists all transactions/orders
func (ctrl *OrderController) Index(c *gin.Context) {
	orders, err := ctrl.orderService.GetAllOrders()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, orders)
}

// Create handles creating a new order/transaction record
func (ctrl *OrderController) Create(c *gin.Context) {
	var input struct {
		Customer      string  `json:"customer" binding:"required"`
		Email         string  `json:"email" binding:"required,email"`
		Avatar        string  `json:"avatar"`
		Amount        float64 `json:"amount" binding:"required"`
		Status        string  `json:"status" binding:"required"`
		Template      string  `json:"template" binding:"required"`
		PaymentMethod string  `json:"payment_method" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	order, err := ctrl.orderService.CreateOrder(
		input.Customer,
		input.Email,
		input.Avatar,
		input.Amount,
		input.Status,
		input.Template,
		input.PaymentMethod,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, order)
}

// UpdateStatus handles transition of payment states (Pending/Paid/Failed)
func (ctrl *OrderController) UpdateStatus(c *gin.Context) {
	orderID := c.Param("order_id")
	var input struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	order, err := ctrl.orderService.UpdateOrderStatus(orderID, input.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, order)
}

// IndexProjects lists all custom projects
func (ctrl *OrderController) IndexProjects(c *gin.Context) {
	projects, err := ctrl.projectService.GetAllProjects()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, projects)
}

// CreateProject handles creation of custom workspace design projects
func (ctrl *OrderController) CreateProject(c *gin.Context) {
	var input struct {
		Title    string `json:"title" binding:"required"`
		Client   string `json:"client" binding:"required"`
		Progress int    `json:"progress"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	project, err := ctrl.projectService.CreateProject(input.Title, input.Client, input.Progress)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, project)
}

// UpdateProjectProgress adjusts completion rates (0-100)
func (ctrl *OrderController) UpdateProjectProgress(c *gin.Context) {
	projectID := c.Param("project_id")
	var input struct {
		Progress int `json:"progress" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	project, err := ctrl.projectService.UpdateProjectProgress(projectID, input.Progress)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, project)
}

// DeleteProject deletes a design project
func (ctrl *OrderController) DeleteProject(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid project ID"})
		return
	}

	if err := ctrl.projectService.DeleteProject(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}
