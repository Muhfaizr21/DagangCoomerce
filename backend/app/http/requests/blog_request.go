package requests

type BlogRequest struct {
	Title           string `json:"title" binding:"required"`
	Slug            string `json:"slug" binding:"required"`
	Category        string `json:"category" binding:"required"`
	Status          string `json:"status" binding:"required"`
	Content         string `json:"content" binding:"required"`
	MetaDescription string `json:"meta_description"`
	MetaKeywords    string `json:"meta_keywords"`
	Thumbnail       string `json:"thumbnail"`
	Date            string `json:"date"`
}
