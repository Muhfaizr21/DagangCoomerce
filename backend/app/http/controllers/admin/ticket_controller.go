package admin

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/muhfaiizr/dagangcommerce/backend/app/services"
)

type TicketController struct {
	service services.TicketService
}

func NewTicketController(service services.TicketService) *TicketController {
	return &TicketController{service: service}
}

// Index lists all tickets
func (ctrl *TicketController) Index(c *gin.Context) {
	tickets, err := ctrl.service.GetAllTickets()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tickets)
}

// Show retrieves single ticket details including message history
func (ctrl *TicketController) Show(c *gin.Context) {
	ticketID := c.Param("ticket_id")
	ticket, err := ctrl.service.GetTicketByTicketID(ticketID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ticket not found"})
		return
	}
	c.JSON(http.StatusOK, ticket)
}

// Create handles creating a support ticket manually
func (ctrl *TicketController) Create(c *gin.Context) {
	var input struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description" binding:"required"`
		Priority    string `json:"priority" binding:"required"`
		Status      string `json:"status" binding:"required"`
		Customer    string `json:"customer" binding:"required"`
		Email       string `json:"email" binding:"required,email"`
		Avatar      string `json:"avatar"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ticket, err := ctrl.service.CreateTicket(
		input.Title,
		input.Description,
		input.Priority,
		input.Status,
		input.Customer,
		input.Email,
		input.Avatar,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, ticket)
}

// CreatePublic handles creating a support ticket from public contact form
func (ctrl *TicketController) CreatePublic(c *gin.Context) {
	var input struct {
		Title       string `json:"title" binding:"required"`
		Description string `json:"description" binding:"required"`
		Customer    string `json:"customer" binding:"required"`
		Email       string `json:"email" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ticket, err := ctrl.service.CreateTicket(
		input.Title,
		input.Description,
		"Medium",
		"Open",
		input.Customer,
		input.Email,
		"",
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, ticket)
}

// UpdatePriority handles shifting ticket priorities (Low/Medium/High)
func (ctrl *TicketController) UpdatePriority(c *gin.Context) {
	ticketID := c.Param("ticket_id")
	var input struct {
		Priority string `json:"priority" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ticket, err := ctrl.service.UpdateTicketPriority(ticketID, input.Priority)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, ticket)
}

// UpdateStatus handles updating support ticket lifecycle states (Open/Active/Resolved/Closed)
func (ctrl *TicketController) UpdateStatus(c *gin.Context) {
	ticketID := c.Param("ticket_id")
	var input struct {
		Status string `json:"status" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ticket, err := ctrl.service.UpdateTicketStatus(ticketID, input.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, ticket)
}

// AddMessage appends customer or staff chat records inside active threads
func (ctrl *TicketController) AddMessage(c *gin.Context) {
	ticketID := c.Param("ticket_id")
	var input struct {
		Sender     string `json:"sender" binding:"required"` // staff or customer
		SenderName string `json:"sender_name" binding:"required"`
		Text       string `json:"text" binding:"required"`
		Avatar     string `json:"avatar"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	message, err := ctrl.service.AddTicketMessage(
		ticketID,
		input.Sender,
		input.SenderName,
		input.Text,
		input.Avatar,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, message)
}

// Delete deletes a support ticket
func (ctrl *TicketController) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ticket ID"})
		return
	}

	if err := ctrl.service.DeleteTicket(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ticket deleted successfully"})
}
