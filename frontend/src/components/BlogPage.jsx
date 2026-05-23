import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8000';

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Fallback beautiful mockup data if backend is offline or empty
  const fallbackBlogs = [
    {
      id: 1,
      title: 'Platform Update 2.4: New Features Overview',
      slug: 'platform-update-2-4',
      category: 'Release Notes',
      date: 'Oct 24, 2023',
      content: 'Kami sangat senang mengumumkan perilisan Platform Update 2.4. Pembaruan ini menghadirkan sinkronisasi inventaris multi-saluran, dasbor laporan penjualan yang dioptimalkan, dan peningkatan kecepatan loading halaman hingga 40%. Semua fitur ini dirancang untuk memperlancar manajemen e-commerce Anda.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 2,
      title: 'How to Optimize Your Marketplace Storefront',
      slug: 'how-to-optimize-marketplace-storefront',
      category: 'Guides',
      date: 'Oct 22, 2023',
      content: 'Mengoptimalkan etalase pasar Anda sangat krusial untuk meningkatkan konversi. Di panduan ini, kita akan membahas cara menyusun tata letak produk yang intuitif, menulis deskripsi produk yang SEO-friendly, dan memanfatkan psikologi warna untuk memikat calon pembeli.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 3,
      title: 'Q3 E-commerce Trends Analysis',
      slug: 'q3-ecommerce-trends-analysis',
      category: 'Industry Insights',
      date: 'Oct 20, 2023',
      content: 'Analisis mendalam mengenai tren e-commerce pada kuartal ketiga (Q3) menunjukkan pergeseran perilaku konsumen ke arah belanja seluler yang semakin cepat dan pembayaran berbasis e-wallet. Pelajari bagaimana Anda dapat menyesuaikan strategi pemasaran toko Anda.',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 4,
      title: '5 Cara Meningkatkan Retensi Pelanggan Toko Online',
      slug: '5-cara-meningkatkan-retensi-pelanggan-toko-online',
      category: 'Guides',
      date: 'Oct 15, 2023',
      content: 'Mendapatkan pelanggan baru membutuhkan biaya jauh lebih besar daripada mempertahankan pelanggan lama. Di artikel ini, pelajari teknik retensi pelanggan mulai dari loyalty program, follow-up cerdas, hingga email marketing personal.',
      thumbnail: 'https://images.unsplash.com/photo-1552581230-c01591d6f5b7?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 5,
      title: 'Panduan Memilih Payment Gateway Terbaik di Indonesia',
      slug: 'panduan-memilih-payment-gateway-terbaik-indonesia',
      category: 'Guides',
      date: 'Oct 10, 2023',
      content: 'Menyediakan metode pembayaran yang lengkap sangat krusial untuk mencegah cart abandonment. Mari bandingkan payment gateway populer di Indonesia dari segi biaya transaksi, kemudahan integrasi, serta kecepatan pencairan dana.',
      thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 6,
      title: 'Strategi Omnichannel untuk UMKM Go Digital',
      slug: 'strategi-omnichannel-untuk-umkm-go-digital',
      category: 'Industry Insights',
      date: 'Oct 05, 2023',
      content: 'Penerapan strategi omnichannel memungkinkan UMKM berjualan di banyak tempat sekaligus dengan sistem terpusat. Pelajari cara menyinkronkan stok toko fisik, marketplace, WhatsApp, dan website pribadi tanpa pusing.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    }
  ];

  useEffect(() => {
    fetchBlogs();
    document.title = 'DagangCommerce Blog | Wawasan E-commerce & Bisnis Digital';
    window.scrollTo(0, 0);

    return () => {
      document.title = 'DagangCommerce | Pembuat Website Toko Online Mudah & Cepat';
    };
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/blogs`);
      if (response.data && response.data.data && response.data.data.length > 0) {
        setBlogs(response.data.data);
      } else {
        setBlogs(fallbackBlogs);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      setBlogs(fallbackBlogs);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          blog.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Featured Blog (First Post)
  const featuredBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const secondaryBlogs = filteredBlogs.length > 1 ? filteredBlogs.slice(1) : [];

  const categories = ['Semua', 'Release Notes', 'Guides', 'Industry Insights'];

  return (
    <div className="min-h-screen py-24 bg-surface-container-lowest">
      <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop">
        
        {/* Page Header Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h1 className="font-headline-lg text-5xl font-extrabold text-on-surface leading-tight">
            Wawasan Bisnis & Toko Online
          </h1>
          <p className="font-body-lg text-body-lg text-secondary">
            Temukan panduan, berita rilis, dan tren e-commerce untuk membantu mengembangkan bisnis Anda di dunia digital.
          </p>
        </div>

        {/* Filters & Search Controls */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-surface-container-low p-6 rounded-3xl border border-outline-variant/30 mb-12 shadow-sm">
          {/* Category Pill Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-[#001A3D] text-white border-transparent shadow-md' 
                    : 'bg-surface hover:bg-surface-container border-outline-variant/60 text-on-surface-variant'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-[20px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel..."
              className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-xl focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm font-semibold bg-surface"
            />
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="space-y-12">
            {/* Featured Post Skeleton */}
            <div className="border border-outline-variant/30 rounded-3xl overflow-hidden bg-surface-container-low p-6 flex flex-col lg:flex-row gap-8 animate-pulse">
              <div className="aspect-[16/10] lg:aspect-square bg-surface-container rounded-2xl w-full lg:w-96 flex-shrink-0"></div>
              <div className="flex-1 space-y-4 py-4">
                <div className="h-6 bg-surface-container rounded-lg w-1/4"></div>
                <div className="h-10 bg-surface-container rounded-lg w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-surface-container rounded-lg w-full"></div>
                  <div className="h-4 bg-surface-container rounded-lg w-5/6"></div>
                </div>
              </div>
            </div>

            {/* Grid Skeletons */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="border border-outline-variant/30 rounded-2xl md:rounded-3xl overflow-hidden bg-surface-container-low p-3 md:p-4 space-y-3 md:space-y-4 animate-pulse">
                  <div className="aspect-[16/10] bg-surface-container rounded-xl md:rounded-2xl w-full"></div>
                  <div className="h-3 md:h-4 bg-surface-container rounded-lg w-1/4"></div>
                  <div className="h-4 md:h-6 bg-surface-container rounded-lg w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          /* Empty Search/Filter State */
          <div className="text-center py-20 bg-surface-container-low rounded-3xl border border-outline-variant/30 space-y-4">
            <span className="material-symbols-outlined text-[64px] text-outline">description</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Tidak Ada Artikel</h3>
            <p className="font-body-md text-body-md text-secondary">
              Maaf, tidak ada artikel yang cocok dengan pencarian atau filter Anda.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); }}
              className="px-5 py-2 bg-[#001A3D] text-white hover:opacity-90 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer border-none"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          /* Article Content */
          <div className="space-y-16">
            
            {/* Featured Post Card (High Impact Hero) */}
            {featuredBlog && (
              <article className="group border border-outline-variant/40 rounded-3xl overflow-hidden bg-surface-container-low hover:bg-surface-container hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row shadow-sm">
                {featuredBlog.thumbnail && (
                  <div className="relative aspect-[16/10] lg:aspect-video lg:w-[48%] overflow-hidden bg-surface-container flex-shrink-0 select-none">
                    <img 
                      src={featuredBlog.thumbnail} 
                      alt={featuredBlog.title} 
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <span className="absolute top-6 left-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001A3D]/80 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
                      FEATURED ARTICLE
                    </span>
                  </div>
                )}
                <div className="p-8 lg:p-10 flex flex-col justify-center flex-1">
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-secondary bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] px-3 py-1 rounded-full w-max mb-4">
                    {featuredBlog.category}
                  </div>
                  
                  <h2 className="font-headline-lg text-3xl font-bold text-on-surface mb-4 leading-tight group-hover:text-primary transition-colors">
                    <Link to={`/blog/${featuredBlog.slug}`} className="hover:underline text-inherit no-underline">
                      {featuredBlog.title}
                    </Link>
                  </h2>
                  
                  <p className="font-body-lg text-body-lg text-on-surface-variant line-clamp-3 mb-6 leading-relaxed">
                    {featuredBlog.content ? featuredBlog.content.replace(/<[^>]*>?/gm, '') : ''}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-outline-variant/30 mt-auto">
                    <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      {featuredBlog.date}
                    </div>
                    <Link 
                      to={`/blog/${featuredBlog.slug}`} 
                      className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all no-underline"
                    >
                      Baca Artikel
                      <span className="material-symbols-outlined text-[16px] text-secondary">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </article>
            )}

            {/* Rest Grid (Secondary Articles) */}
            {secondaryBlogs.length > 0 && (
              <div className="space-y-6 md:space-y-8">
                <h3 className="text-base md:text-headline-sm text-primary font-bold border-b border-outline-variant/30 pb-3">
                  Artikel Menarik Lainnya
                </h3>
                
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
                  {secondaryBlogs.map((blog) => (
                    <article 
                      key={blog.id} 
                      className="group border border-outline-variant/40 rounded-2xl md:rounded-3xl overflow-hidden bg-surface-container-low hover:bg-surface-container hover:shadow-xl transition-all duration-300 flex flex-col h-full shadow-sm"
                    >
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-surface-container select-none">
                        {blog.thumbnail ? (
                          <img 
                            src={blog.thumbnail} 
                            alt={blog.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-surface-container text-outline">
                            <span className="material-symbols-outlined text-[32px] md:text-[48px]">image</span>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 md:top-4 md:left-4 inline-flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-[#001A3D]/80 backdrop-blur-md text-white text-[9px] md:text-[11px] font-bold shadow-md">
                          {blog.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-3 md:p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs font-semibold text-secondary mb-2 md:mb-3">
                          <span className="material-symbols-outlined text-[12px] md:text-[14px]">calendar_today</span>
                          {blog.date}
                        </div>
                        
                        <h4 className="text-xs md:text-headline-sm text-on-surface mb-2 md:mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug font-bold">
                          <Link to={`/blog/${blog.slug}`} className="hover:underline text-inherit no-underline">
                            {blog.title}
                          </Link>
                        </h4>
                        
                        <p className="hidden md:block font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-6 leading-relaxed flex-grow">
                          {blog.content ? blog.content.replace(/<[^>]*>?/gm, '') : ''}
                        </p>

                        <div className="pt-2 md:pt-4 border-t border-outline-variant/30 flex justify-between items-center mt-auto">
                          <Link 
                            to={`/blog/${blog.slug}`} 
                            className="inline-flex items-center gap-1 md:gap-2 text-primary font-bold text-[10px] md:text-sm hover:gap-3 transition-all duration-200 no-underline"
                          >
                            <span>Baca<span className="hidden md:inline"> Selengkapnya</span></span>
                            <span className="material-symbols-outlined text-[12px] md:text-[16px] text-secondary">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default BlogPage;
