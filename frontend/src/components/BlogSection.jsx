import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8000';

function BlogSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback beautiful mockup data if backend is offline or empty
  const fallbackBlogs = [
    {
      id: 1,
      title: 'Platform Update 2.4: New Features Overview',
      slug: 'platform-update-2-4',
      category: 'Release Notes',
      date: 'Oct 24, 2023',
      content: 'Kami sangat senang mengumumkan perilisan Platform Update 2.4. Pembaruan ini menghadirkan sinkronisasi inventaris multi-saluran, dasbor laporan penjualan yang dioptimalkan, dan peningkatan kecepatan...',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 2,
      title: 'How to Optimize Your Marketplace Storefront',
      slug: 'how-to-optimize-marketplace-storefront',
      category: 'Guides',
      date: 'Oct 22, 2023',
      content: 'Mengoptimalkan etalase pasar Anda sangat krusial untuk meningkatkan konversi. Di panduan ini, kita akan membahas cara menyusun tata letak produk yang intuitif, menulis deskripsi produk...',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 3,
      title: 'Q3 E-commerce Trends Analysis',
      slug: 'q3-ecommerce-trends-analysis',
      category: 'Industry Insights',
      date: 'Oct 20, 2023',
      content: 'Analisis mendalam mengenai tren e-commerce pada kuartal ketiga (Q3) menunjukkan pergeseran perilaku konsumen ke arah belanja seluler yang semakin cepat dan pembayaran berbasis e-wallet...',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800',
    },
  ];

  useEffect(() => {
    fetchBlogs();
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
      console.error('Failed to fetch blogs from API:', error);
      // Fail gracefully and use beautiful fallback blogs
      setBlogs(fallbackBlogs);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="blog" className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container text-secondary text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
              <span className="material-symbols-outlined text-[14px]">auto_stories</span>
              Informasi & Blog
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
              Wawasan Terbaru untuk Sukses Berbisnis
            </h2>
            <p className="font-body-lg text-body-lg text-secondary">
              Temukan tips praktis, panduan digitalisasi, dan wawasan industri e-commerce untuk melejitkan bisnis Anda.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={fetchBlogs}
              className="flex items-center gap-2 text-primary font-bold hover:text-secondary hover:underline transition-all bg-transparent border-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] transition-transform duration-300 hover:rotate-180">sync</span>
              Segarkan Berita
            </button>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="border border-outline-variant/30 rounded-3xl overflow-hidden bg-surface-container-low p-4 space-y-4 animate-pulse">
                <div className="aspect-[16/10] bg-surface-container rounded-2xl w-full"></div>
                <div className="h-4 bg-surface-container rounded-lg w-1/4"></div>
                <div className="h-6 bg-surface-container rounded-lg w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-surface-container rounded-lg w-full"></div>
                  <div className="h-4 bg-surface-container rounded-lg w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Blog Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article 
                key={blog.id} 
                className="group border border-outline-variant/40 rounded-3xl overflow-hidden bg-surface-container-low hover:bg-surface-container hover:shadow-xl hover:border-secondary/20 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image & Tag */}
                <div className="relative aspect-[16/10] overflow-hidden bg-surface-container select-none">
                  {blog.thumbnail ? (
                    <img 
                      src={blog.thumbnail} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-container text-outline">
                      <span className="material-symbols-outlined text-[48px]">image</span>
                    </div>
                  )}
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001A3D]/80 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
                    {blog.category}
                  </span>
                </div>

                {/* Text Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs font-semibold text-secondary mb-3">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    {blog.date}
                  </div>
                  
                  <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    <Link to={`/blog/${blog.slug}`} className="hover:underline text-inherit no-underline">
                      {blog.title}
                    </Link>
                  </h3>
                  
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-6 leading-relaxed flex-grow">
                    {blog.content ? blog.content.replace(/<[^>]*>?/gm, '') : ''}
                  </p>

                  <div className="pt-4 border-t border-outline-variant/30 flex justify-between items-center mt-auto">
                    <Link 
                      to={`/blog/${blog.slug}`} 
                      className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all duration-200 no-underline"
                    >
                      Baca Selengkapnya
                      <span className="material-symbols-outlined text-[16px] text-secondary">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default BlogSection;
