package models

import (
	"time"

	"gorm.io/gorm"
)

type Project struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	ProjectID string         `gorm:"size:100;uniqueIndex;not null" json:"project_id"`
	Title     string         `gorm:"size:255;not null" json:"title"`
	Client    string         `gorm:"size:255;not null" json:"client"`
	Progress  int            `gorm:"default:0" json:"progress"`
	StagesStr string         `gorm:"type:text;column:stages" json:"-"` // internal storage
	Stages    []string       `gorm:"-" json:"stages"`                  // parsed array for json response
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

// AfterFind is a GORM hook to deserialize the Stages string to array
func (p *Project) AfterFind(tx *gorm.DB) (err error) {
	p.Stages = []string{"Planning", "Hardware", "Software", "Live"} // standard fixed stages as defined in frontend
	return nil
}
