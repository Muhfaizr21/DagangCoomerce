package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/muhfaiizr/dagangcommerce/backend/app/http/requests"
	"github.com/muhfaiizr/dagangcommerce/backend/app/services"
)

type BlogController struct {
	service services.BlogService
}

func NewBlogController(service services.BlogService) *BlogController {
	return &BlogController{service: service}
}

// Index lists all published blog posts (for landing page)
func (c *BlogController) Index(ctx *gin.Context) {
	blogs, err := c.service.GetPublishedBlogs()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": blogs,
	})
}

// Show retrieves a blog post by its slug (for blog detail page)
func (c *BlogController) Show(ctx *gin.Context) {
	slug := ctx.Param("slug")
	blog, err := c.service.GetBlogBySlug(slug)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": "Blog post not found",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": blog,
	})
}

// AdminIndex lists all blogs (for admin dashboard, draft & in review included)
func (c *BlogController) AdminIndex(ctx *gin.Context) {
	blogs, err := c.service.GetAllBlogs()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": blogs,
	})
}

// AdminStore creates a new blog post
func (c *BlogController) AdminStore(ctx *gin.Context) {
	var req requests.BlogRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{
			"message": "Validation failed",
			"errors":  err.Error(),
		})
		return
	}

	blog, err := c.service.CreateBlog(
		req.Title,
		req.Slug,
		req.Category,
		req.Status,
		req.Content,
		req.MetaDescription,
		req.MetaKeywords,
		req.Thumbnail,
		req.Date,
	)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Blog post published successfully",
		"data":    blog,
	})
}

// AdminUpdate updates an existing blog post
func (c *BlogController) AdminUpdate(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid blog post ID",
		})
		return
	}

	var req requests.BlogRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{
			"message": "Validation failed",
			"errors":  err.Error(),
		})
		return
	}

	blog, err := c.service.UpdateBlog(
		uint(id),
		req.Title,
		req.Slug,
		req.Category,
		req.Status,
		req.Content,
		req.MetaDescription,
		req.MetaKeywords,
		req.Thumbnail,
		req.Date,
	)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Blog post updated successfully",
		"data":    blog,
	})
}

// AdminDelete deletes an existing blog post
func (c *BlogController) AdminDelete(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid blog post ID",
		})
		return
	}

	if err := c.service.DeleteBlog(uint(id)); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Blog post deleted successfully",
	})
}
