package seeders

import (
	"errors"
	"log"

	"github.com/muhfaiizr/dagangcommerce/backend/app/models"
	"gorm.io/gorm"
)

func SeedBlogs(db *gorm.DB) {
	blogs := []models.Blog{
		{
			Title:           "Platform Update 2.4: New Features Overview",
			Slug:            "platform-update-2-4",
			Category:        "Release Notes",
			Status:          "Published",
			Date:            "May 19, 2026",
			Content:         "Kami sangat senang mengumumkan perilisan Platform Update 2.4. Pembaruan ini menghadirkan sinkronisasi inventaris multi-saluran, dasbor laporan penjualan yang dioptimalkan, dan peningkatan kecepatan loading halaman hingga 40%. Semua fitur ini dirancang untuk memperlancar manajemen e-commerce Anda.",
			MetaDescription: "Discover the latest features in Platform Update 2.4 including multi-channel sync and optimized dashboards.",
			MetaKeywords:    "update, features, ecommerce, sync",
			Thumbnail:       "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
		},
		{
			Title:           "Cara Mengoptimalkan Etalase Toko Online Anda",
			Slug:            "cara-mengoptimalkan-etalase-toko-online",
			Category:        "Guides",
			Status:          "Published",
			Date:            "May 18, 2026",
			Content:         "Mengoptimalkan etalase toko online Anda sangat krusial untuk meningkatkan konversi penjualan. Di panduan ini, kita akan membahas cara menyusun tata letak produk yang intuitif, menulis deskripsi produk yang SEO-friendly, dan memanfaatkan psikologi warna untuk memikat calon pembeli.",
			MetaDescription: "Learn how to optimize your storefront to increase conversions and attract more buyers.",
			MetaKeywords:    "optimization, storefront, guide, conversion",
			Thumbnail:       "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
		},
		{
			Title:           "Analisis Tren E-commerce Q3",
			Slug:            "analisis-tren-ecommerce-q3",
			Category:        "Industry Insights",
			Status:          "Published",
			Date:            "May 15, 2026",
			Content:         "Analisis mendalam mengenai tren e-commerce pada kuartal ketiga menunjukkan pergeseran perilaku konsumen ke arah belanja seluler yang semakin cepat dan pembayaran berbasis e-wallet. Pelajari bagaimana Anda dapat menyesuaikan strategi pemasaran toko Anda untuk menangkap peluang ini.",
			MetaDescription: "In-depth analysis of Q3 e-commerce trends, highlighting mobile shopping and e-wallet payments.",
			MetaKeywords:    "trends, Q3, ecommerce, analysis",
			Thumbnail:       "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800",
		},
		{
			Title:           "5 Strategi Jitu Retensi Pelanggan",
			Slug:            "5-strategi-jitu-retensi-pelanggan",
			Category:        "Guides",
			Status:          "Published",
			Date:            "May 12, 2026",
			Content:         "Mendapatkan pelanggan baru membutuhkan biaya jauh lebih besar daripada mempertahankan pelanggan lama. Di artikel ini, pelajari teknik retensi pelanggan mulai dari loyalty program, follow-up cerdas, hingga email marketing personal untuk menjaga agar mereka tetap setia berbelanja.",
			MetaDescription: "Learn customer retention strategies for online businesses including loyalty programs and email marketing.",
			MetaKeywords:    "retention, customer loyalty, online business",
			Thumbnail:       "https://images.unsplash.com/photo-1552581230-c01591d6f5b7?auto=format&fit=crop&q=80&w=800",
		},
		{
			Title:           "Panduan Memilih Payment Gateway Terbaik",
			Slug:            "panduan-memilih-payment-gateway-terbaik",
			Category:        "Guides",
			Status:          "Published",
			Date:            "May 09, 2026",
			Content:         "Menyediakan metode pembayaran yang lengkap sangat krusial untuk mencegah pembatalan belanja (cart abandonment). Mari bandingkan payment gateway populer di Indonesia dari segi biaya transaksi, kemudahan integrasi, serta kecepatan pencairan dana demi kepuasan pelanggan.",
			MetaDescription: "Compare payment gateways in Indonesia to select the best one for your e-commerce website.",
			MetaKeywords:    "payment gateway, checkout, midtrans, xendit",
			Thumbnail:       "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800",
		},
		{
			Title:           "Strategi Omnichannel untuk UMKM Sukses",
			Slug:            "strategi-omnichannel-untuk-umkm-sukses",
			Category:        "Industry Insights",
			Status:          "Published",
			Date:            "May 06, 2026",
			Content:         "Penerapan strategi omnichannel memungkinkan UMKM berjualan di banyak tempat sekaligus dengan sistem terpusat. Pelajari cara menyinkronkan stok toko fisik, marketplace, WhatsApp, dan website pribadi tanpa pusing dan menghindari selisih pencatatan inventaris.",
			MetaDescription: "Learn omnichannel strategies for local MSMEs to centralize stock across offline and online channels.",
			MetaKeywords:    "omnichannel, msme, inventory sync, multi-channel",
			Thumbnail:       "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
		},
		{
			Title:           "Pentingnya Keamanan Data Transaksi Pelanggan",
			Slug:            "pentingnya-keamanan-data-transaksi-pelanggan",
			Category:        "Guides",
			Status:          "Published",
			Date:            "May 02, 2026",
			Content:         "Membangun kepercayaan pelanggan dimulai dengan melindungi data sensitif mereka. Artikel ini membahas cara kerja protokol keamanan web SSL, enkripsi data transaksi, dan langkah-langkah praktis mengamankan website toko online Anda dari ancaman siber.",
			MetaDescription: "Understand the importance of data security for online transactions and securing e-commerce stores.",
			MetaKeywords:    "security, ssl, encryption, transaction data",
			Thumbnail:       "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
		},
	}

	for _, b := range blogs {
		var existing models.Blog
		err := db.Where("slug = ?", b.Slug).First(&existing).Error
		if errors.Is(err, gorm.ErrRecordNotFound) {
			if err := db.Create(&b).Error; err != nil {
				log.Printf("Warning: failed to seed blog %s: %v", b.Slug, err)
			} else {
				log.Printf("Seeded blog post: %s", b.Title)
			}
		} else if err == nil {
			// Update existing content to match new seed content
			existing.Title = b.Title
			existing.Category = b.Category
			existing.Status = b.Status
			existing.Content = b.Content
			existing.MetaDescription = b.MetaDescription
			existing.MetaKeywords = b.MetaKeywords
			existing.Thumbnail = b.Thumbnail
			existing.Date = b.Date
			db.Save(&existing)
			log.Printf("Updated existing blog post: %s", b.Title)
		} else {
			log.Printf("Error checking existence of blog %s: %v", b.Slug, err)
		}
	}
}
