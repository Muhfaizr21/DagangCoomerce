package seeders

import (
	"errors"
	"log"
	"time"

	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
	"gorm.io/gorm"
)

func SeedAdminDashboardData(db *gorm.DB) {
	log.Println("Seeding Admin Dashboard data...")

	// 1. Seed Customers
	customers := []models.Customer{
		{
			Name:      "Budi Santoso",
			Email:     "budi.s@example.com",
			Status:    "Active",
			Templates: 4,
			Spend:     4500000,
			Segment:   "Individual",
			Avatar:    "https://lh3.googleusercontent.com/aida-public/AB6AXuABmwmkOGwcPpaS_H4VnjOiLsnrGGfyE_dQzlCoMHfdZRvW70ZERX0Bou1PIxlW3xHWHJfwZ7vDbdANI7TKqX33lLMRYFGDzp3lFSUk4ORxBMNafEUCaob4PVrBJES0vumlVwac_bGmt4H2o5_tQBYuRCrX0IF7xHoPmSd7W40P0SJSyjyNU0utznFVm30nsIDkFF6TGOX0IzEhHnysxgmUCokvU9Ap2361LzYd48sI05eubGOu5ER_jVLM4lF8wrGuwL6yM5d7WQhO",
		},
		{
			Name:      "Tech Solutions Inc.",
			Email:     "admin@techsolutions.com",
			Status:    "Revoked",
			Templates: 12,
			Spend:     15200000,
			Segment:   "Enterprise",
			Avatar:    "TS",
		},
		{
			Name:      "Siti Aminah",
			Email:     "siti.a@gmail.com",
			Status:    "Trial",
			Templates: 1,
			Spend:     0,
			Segment:   "Trial",
			Avatar:    "https://lh3.googleusercontent.com/aida-public/AB6AXuC2VFXAtb256mAdZfMpeeccAvLMzFxtRqBfA3X9JPXqwuV2LUpE9ck5pnJ3soMnLYpDTX3JT7yiuOB-X1lPQPp3hfQc80LJdrNvHiwpZdxtFOnTOUGQUERSkeVCeg-7UQN-UU8jL-v9cM2rC0U-9i1pQcZ9nYUszDZ441DKJdinmNTuqqtV5dKN7pyEeDbX2N3l20i_mMoq2Bj5EDTnBqlXP6wXYF60gzKOaPwpRWVKQA-x2tUf2XAeuXh05rV9PVmOOCdCiHZSorxZ",
		},
		{
			Name:      "Aditya Pratama",
			Email:     "aditya.p@gmail.com",
			Status:    "Active",
			Templates: 2,
			Spend:     1800000,
			Segment:   "Individual",
			Avatar:    "AP",
		},
		{
			Name:      "Syarifah Aulia",
			Email:     "syarifah.a@company.co.id",
			Status:    "Active",
			Templates: 9,
			Spend:     11500000,
			Segment:   "Enterprise",
			Avatar:    "SA",
		},
	}

	for _, c := range customers {
		var existing models.Customer
		err := db.Where("email = ?", c.Email).First(&existing).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			db.Create(&c)
		}
	}

	// 2. Seed Customer Activities
	activities := []models.CustomerActivity{
		{
			CustomerName: "Budi Santoso",
			Action:       "purchased E-Commerce Pro Template.",
			Type:         "purchase",
			CreatedAt:    time.Now().Add(-2 * time.Minute),
		},
		{
			CustomerName: "Tech Solutions Inc.",
			Action:       "DRM Access revoked by Super Admin.",
			Type:         "revoke",
			CreatedAt:    time.Now().Add(-1 * time.Hour),
		},
		{
			CustomerName: "Siti Aminah",
			Action:       "started a trial plan.",
			Type:         "trial",
			CreatedAt:    time.Now().Add(-3 * time.Hour),
		},
	}

	var actCount int64
	db.Model(&models.CustomerActivity{}).Count(&actCount)
	if actCount == 0 {
		for _, a := range activities {
			db.Create(&a)
		}
	}

	// 3. Seed Orders & Timelines
	orders := []models.Order{
		{
			OrderID:       "ORD-9921",
			Customer:      "Ahmad Syahmi",
			Email:         "ahmad.syahmi@gmail.com",
			Avatar:        "AS",
			Amount:        12500000,
			Status:        "Paid",
			Template:      "Urbane Apparel",
			PaymentMethod: "Transfer Virtual Account",
		},
		{
			OrderID:       "ORD-9920",
			Customer:      "Lim Wei Ting",
			Email:         "weiting.lim@outlook.my",
			Avatar:        "LT",
			Amount:        45000000,
			Status:        "Pending",
			Template:      "The Gourmet",
			PaymentMethod: "Stripe Credit Card",
		},
		{
			OrderID:       "ORD-9919",
			Customer:      "Siti Maimunah",
			Email:         "siti.m@yahoo.com",
			Avatar:        "SM",
			Amount:        8500000,
			Status:        "Failed",
			Template:      "Bistro Brew",
			PaymentMethod: "Transfer Virtual Account",
		},
	}

	for _, o := range orders {
		var existing models.Order
		err := db.Where("order_id = ?", o.OrderID).First(&existing).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			db.Create(&o)
			// Seed timelines
			if o.OrderID == "ORD-9921" {
				db.Create(&models.OrderTimeline{OrderID: o.OrderID, Title: "Order Created", Desc: "Customer initiated checkout", Done: true, CreatedAt: time.Now()})
				db.Create(&models.OrderTimeline{OrderID: o.OrderID, Title: "Payment Authorized", Desc: "Payment Gateway callback verified", Done: true, CreatedAt: time.Now()})
				db.Create(&models.OrderTimeline{OrderID: o.OrderID, Title: "DFY Setup Queued", Desc: "Assigned to automated build agent", Done: true, CreatedAt: time.Now()})
			} else if o.OrderID == "ORD-9920" {
				db.Create(&models.OrderTimeline{OrderID: o.OrderID, Title: "Order Created", Desc: "Customer initiated checkout", Done: true, CreatedAt: time.Now()})
				db.Create(&models.OrderTimeline{OrderID: o.OrderID, Title: "Payment Pending", Desc: "Awaiting 3D-Secure authorization callback", Done: false, CreatedAt: time.Now()})
			} else if o.OrderID == "ORD-9919" {
				db.Create(&models.OrderTimeline{OrderID: o.OrderID, Title: "Order Created", Desc: "Customer initiated checkout", Done: true, CreatedAt: time.Now()})
				db.Create(&models.OrderTimeline{OrderID: o.OrderID, Title: "Payment Failed", Desc: "Customer cancelled transaction or timeout", Done: true, CreatedAt: time.Now()})
			}
		}
	}

	// 4. Seed Projects
	projects := []models.Project{
		{
			ProjectID: "PROJ-1",
			Title:     "MegaMall Kiosk Setup",
			Client:    "RetailCorp Bhd.",
			Progress:  85,
			StagesStr: "Planning,Hardware,Software,Live",
		},
		{
			ProjectID: "PROJ-2",
			Title:     "Boutique POS Integration",
			Client:    "Style Haven",
			Progress:  40,
			StagesStr: "Planning,Hardware,Software,Live",
		},
		{
			ProjectID: "PROJ-3",
			Title:     "Cafe Network Update",
			Client:    "Brews & Beans",
			Progress:  15,
			StagesStr: "Planning,Hardware,Software,Live",
		},
	}

	for _, p := range projects {
		var existing models.Project
		err := db.Where("project_id = ?", p.ProjectID).First(&existing).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			db.Create(&p)
		}
	}

	// 5. Seed Tickets & Messages
	tickets := []models.Ticket{
		{
			TicketID:    "TK-4029",
			Title:       "Payment Gateway Timeout Error",
			Description: "Customers are reporting timeouts when trying to checkout using the new Stripe integration on mobile devices.",
			Priority:    "High",
			Status:      "Open",
			Customer:    "Sarah Jenkins",
			Email:       "sarah.j@example.com",
			Avatar:      "https://lh3.googleusercontent.com/aida-public/AB6AXuCji7JUZ8NuL_H84DWd2pad2PM-QiCWhVmv9TeUogwvkWxhOFsCwTdKMmIbeRVzQb7vwAPQmL86qiADUZbjIkC18IMpmiMKtui0Yb6vxvhEE_IZPAXHo-FENtLDVI1lA_w0MDtHYLcrZKkK2OTTLgUqwNcF1zrGRbSd6705suiTyYgX_KT1QGFA_4k7Ht-3l5B7kwWohPDTdQAMW_6z49V7nZAN-rrMua2iyZO0pdW8ugDzawrENY_J5EmbuD6Q0_4l6q9I3jSVEgvl",
		},
		{
			TicketID:    "TK-4028",
			Title:       "Product Images Not Loading",
			Description: "Several items in the electronics category are showing broken image placeholders instead of the actual product photos.",
			Priority:    "Medium",
			Status:      "Open",
			Customer:    "Mike R.",
			Email:       "mike.retail@outlook.com",
			Avatar:      "MR",
		},
	}

	for _, t := range tickets {
		var existing models.Ticket
		err := db.Where("ticket_id = ?", t.TicketID).First(&existing).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			db.Create(&t)
			// Seed messages
			if t.TicketID == "TK-4029" {
				db.Create(&models.TicketMessage{
					TicketID:   t.TicketID,
					Sender:     "customer",
					SenderName: "Sarah Jenkins",
					Text:       "Hi team, I'm trying to purchase the new marketing templates but every time I hit checkout on my iPhone, the screen just spins for 30 seconds and then gives me a \"Gateway Timeout 504\" error.",
					Avatar:     "https://lh3.googleusercontent.com/aida-public/AB6AXuCx0iUm13TuBBMR5GuEYKxjBE9UsJHQ8KriKqs7LwVgqkVwpcxfEHPJzr3XjnzhOSWFmGIHO3_EYzC2OwAHiwk9SuQsLMs3OLzasLh3JsDb9kwJQfV8a69aRBgJqHGXKaFi4cMK-EYfNLDSEvOOg4Yojy7bpX_PPp_rq0qYUToRwhptQrop_N6Kkhr9nO2xo5tHA4PgdsP3hok2vwIFwkTgo3DiatiXqjULd3g2l6hto08lFkuvqQypP-Lz_QpZIc0KvIVvfCmB0_1a",
					CreatedAt:  time.Now().Add(-20 * time.Minute),
				})
				db.Create(&models.TicketMessage{
					TicketID:   t.TicketID,
					Sender:     "agent",
					SenderName: "Super Admin",
					Text:       "Hello Sarah, I'm sorry to hear you're experiencing this issue. We are currently investigating some sporadic timeouts with our Stripe integration specifically on mobile Safari.",
					Avatar:     "https://lh3.googleusercontent.com/aida-public/AB6AXuDQqk_Ls3KpbHFZ4R5wUhwPnvDkiTcmejMUnfqqL6EY-MpD2XgX01FitP7uXaVPJw0cpzmsmXIg_BGx7Z7EL0ng1dh4o1JpC9NDnnVi_7gbXjHo0-xNcPU5z3KxYxFu9boz206fmKM249YoNabZ49kfFI5xlIeexd1y-iM14ScP8NqGazC2ULXDKYvvTN1K-cIlBZ-Xz_WTnZt7LtG7t-gx95hOg7zD-wzc3tpxziANEJflg5XWkbe38Yt75M9Kq7LamrnxL3ApV7uA",
					CreatedAt:  time.Now().Add(-15 * time.Minute),
				})
			} else if t.TicketID == "TK-4028" {
				db.Create(&models.TicketMessage{
					TicketID:   t.TicketID,
					Sender:     "customer",
					SenderName: "Mike R.",
					Text:       "Hey, several electronics category templates I installed are displaying broken images. Check out the camera and headphone product details pages - their source links look broken.",
					Avatar:     "MR",
					CreatedAt:  time.Now().Add(-1 * time.Hour),
				})
			}
		}
	}

	log.Println("Admin Dashboard data seeded successfully.")
}
