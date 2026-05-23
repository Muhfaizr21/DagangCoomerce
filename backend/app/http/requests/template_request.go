package requests

type TemplateRequest struct {
	Name        string  `json:"name" binding:"required"`
	Category    string  `json:"category" binding:"required"`
	Version     string  `json:"version"`
	Price       float64 `json:"price" binding:"required,gte=0"`
	Status      string  `json:"status"`
	Image       string  `json:"image"`
	DemoURL     string  `json:"demoUrl"`
	Description string  `json:"description"`
}
