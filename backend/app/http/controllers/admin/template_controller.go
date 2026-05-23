package admin

import (
	"archive/zip"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/muhfaiizr/dagangcommerce/backend/app/http/requests"
	"github.com/muhfaiizr/dagangcommerce/backend/app/services"
)

type TemplateController struct {
	service services.TemplateService
}

func NewTemplateController(service services.TemplateService) *TemplateController {
	return &TemplateController{service: service}
}

// Index lists all active templates (for the public catalog page)
func (c *TemplateController) Index(ctx *gin.Context) {
	templates, err := c.service.GetActiveTemplates()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": templates,
	})
}

// Show retrieves a specific template by its ID
func (c *TemplateController) Show(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid template ID",
		})
		return
	}

	t, err := c.service.GetTemplateByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"message": "Template not found",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": t,
	})
}

// AdminIndex lists all templates (for the administrative panel)
func (c *TemplateController) AdminIndex(ctx *gin.Context) {
	templates, err := c.service.GetAllTemplates()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": templates,
	})
}

// AdminStore creates a new template
func (c *TemplateController) AdminStore(ctx *gin.Context) {
	var req requests.TemplateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{
			"message": "Validation failed",
			"errors":  err.Error(),
		})
		return
	}

	t, err := c.service.CreateTemplate(
		req.Name,
		req.Category,
		req.Version,
		req.Price,
		req.Status,
		req.Image,
		req.DemoURL,
		req.Description,
	)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"message": "Template created successfully",
		"data":    t,
	})
}

// AdminUpdate updates an existing template
func (c *TemplateController) AdminUpdate(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid template ID",
		})
		return
	}

	var req requests.TemplateRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusUnprocessableEntity, gin.H{
			"message": "Validation failed",
			"errors":  err.Error(),
		})
		return
	}

	t, err := c.service.UpdateTemplate(
		uint(id),
		req.Name,
		req.Category,
		req.Version,
		req.Price,
		req.Status,
		req.Image,
		req.DemoURL,
		req.Description,
	)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Template updated successfully",
		"data":    t,
	})
}

// AdminDelete deletes an existing template
func (c *TemplateController) AdminDelete(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Invalid template ID",
		})
		return
	}

	if err := c.service.DeleteTemplate(uint(id)); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Template deleted successfully",
	})
}

// UploadTemplateFiles handles uploading a template's thumbnail image and source ZIP code
func (c *TemplateController) UploadTemplateFiles(ctx *gin.Context) {
	// Parse multipart form
	form, err := ctx.MultipartForm()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "Failed to parse multipart form",
			"error":   err.Error(),
		})
		return
	}

	folderName := ctx.PostForm("folder_name")
	if folderName == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"message": "folder_name is required",
		})
		return
	}

	// Clean folder name to prevent folder traversal (alphanumeric and dashes only)
	folderName = cleanFolderName(folderName)

	var thumbnailUrl string
	var demoUrl string

	// 1. Handle Thumbnail Upload if present
	thumbnailFiles := form.File["thumbnail"]
	if len(thumbnailFiles) > 0 {
		file := thumbnailFiles[0]
		// Create uploads folder if it doesn't exist
		if err := os.MkdirAll("./uploads/thumbnails", os.ModePerm); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to create upload directory",
				"error":   err.Error(),
			})
			return
		}

		ext := filepath.Ext(file.Filename)
		fileName := folderName + "_" + strconv.FormatInt(time.Now().Unix(), 10) + ext
		dst := filepath.Join("uploads", "thumbnails", fileName)

		if err := ctx.SaveUploadedFile(file, dst); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to save thumbnail image",
				"error":   err.Error(),
			})
			return
		}
		thumbnailUrl = "http://localhost:8000/uploads/thumbnails/" + fileName
	}

	// 2. Handle ZIP File Upload and Extraction if present
	zipFiles := form.File["zip_file"]
	if len(zipFiles) > 0 {
		file := zipFiles[0]
		// Ensure temp directory exists
		if err := os.MkdirAll("./tmp", os.ModePerm); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to create temp directory",
				"error":   err.Error(),
			})
			return
		}

		tempZipPath := filepath.Join("tmp", folderName+"_"+strconv.FormatInt(time.Now().Unix(), 10)+".zip")
		if err := ctx.SaveUploadedFile(file, tempZipPath); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to save ZIP file",
				"error":   err.Error(),
			})
			return
		}
		defer os.Remove(tempZipPath) // Clean up temp zip file

		// Resolve path to frontend public demos
		destDir := filepath.Join("..", "frontend", "public", "demos", folderName)
		
		// Remove existing folder if it exists to overwrite cleanly
		os.RemoveAll(destDir)
		if err := os.MkdirAll(destDir, os.ModePerm); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to create destination folder for template files",
				"error":   err.Error(),
			})
			return
		}

		// Extract the zip files
		if err := unzip(tempZipPath, destDir); err != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{
				"message": "Failed to extract template ZIP archive",
				"error":   err.Error(),
			})
			return
		}

		demoUrl = "http://localhost:5173/demos/" + folderName + "/index.html"
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":      "Files successfully uploaded and processed",
		"thumbnailUrl": thumbnailUrl,
		"demoUrl":      demoUrl,
	})
}

// cleanFolderName sanitizes folder name to keep it alphanumeric, hyphens, and underscores only
func cleanFolderName(s string) string {
	var sb strings.Builder
	for _, r := range strings.ToLower(s) {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' || r == '_' {
			sb.WriteRune(r)
		} else if r == ' ' {
			sb.WriteRune('-')
		}
	}
	return sb.String()
}

// unzip extracts a zip file into a target directory
func unzip(src string, dest string) error {
	r, err := zip.OpenReader(src)
	if err != nil {
		return err
	}
	defer r.Close()

	for _, f := range r.File {
		// Prevent Zip Slip vulnerability
		fpath := filepath.Join(dest, f.Name)
		if !strings.HasPrefix(fpath, filepath.Clean(dest)+string(os.PathSeparator)) {
			continue
		}

		if f.FileInfo().IsDir() {
			os.MkdirAll(fpath, os.ModePerm)
			continue
		}

		if err = os.MkdirAll(filepath.Dir(fpath), os.ModePerm); err != nil {
			return err
		}

		outFile, err := os.OpenFile(fpath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
		if err != nil {
			return err
		}

		rc, err := f.Open()
		if err != nil {
			outFile.Close()
			return err
		}

		_, err = io.Copy(outFile, rc)
		outFile.Close()
		rc.Close()
		if err != nil {
			return err
		}
	}
	return nil
}
