import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8000';

function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fallback map to find local dummy post if the server is offline/doesn't have it
  const fallbackBlogs = [
    {
      id: 1,
      title: 'Platform Update 2.4: New Features Overview',
      slug: 'platform-update-2-4',
      category: 'Release Notes',
      date: 'Oct 24, 2023',
      content: 'Kami sangat senang mengumumkan perilisan Platform Update 2.4. Pembaruan ini menghadirkan sinkronisasi inventaris multi-saluran, dasbor laporan penjualan yang dioptimalkan, dan peningkatan kecepatan loading halaman hingga 40%. Semua fitur ini dirancang untuk memperlancar manajemen e-commerce Anda.\n\nDalam rilis kali ini, fokus kami adalah kecepatan dan automasi. Dengan sinkronisasi multi-saluran, Anda dapat mengelola stok produk di Tokopedia, Shopee, dan TikTok Shop langsung dari satu dasbor pusat DagangCommerce tanpa perlu khawatir double-sell atau selisih stok. Coba sekarang dan nikmati efisiensinya!',
      metaDescription: 'Discover the latest features in Platform Update 2.4 including multi-channel sync and optimized dashboards.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    },
    {
      id: 2,
      title: 'How to Optimize Your Marketplace Storefront',
      slug: 'how-to-optimize-marketplace-storefront',
      category: 'Guides',
      date: 'Oct 22, 2023',
      content: 'Mengoptimalkan etalase pasar Anda sangat krusial untuk meningkatkan konversi. Di panduan ini, kita akan membahas cara menyusun tata letak produk yang intuitif, menulis deskripsi produk yang SEO-friendly, dan memanfatkan psikologi warna untuk memikat calon pembeli.\n\nTata letak yang berantakan sering membuat pembeli langsung menutup tab toko Anda. Gunakan hierarki produk yang jelas: letakkan produk best-seller di baris paling atas, diikuti oleh promo menarik di bawahnya. Selain itu, lengkapi foto produk dengan pencahayaan profesional agar terlihat sangat premium.',
      metaDescription: 'Learn how to optimize your storefront to increase conversions and attract more buyers.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    },
    {
      id: 3,
      title: 'Q3 E-commerce Trends Analysis',
      slug: 'q3-ecommerce-trends-analysis',
      category: 'Industry Insights',
      date: 'Oct 20, 2023',
      content: 'Analisis mendalam mengenai tren e-commerce pada kuartal ketiga (Q3) menunjukkan pergeseran perilaku konsumen ke arah belanja seluler yang semakin cepat dan pembayaran berbasis e-wallet. Pelajari bagaimana Anda dapat menyesuaikan strategi pemasaran toko Anda.\n\nData menunjukkan lebih dari 82% transaksi e-commerce kini terjadi melalui perangkat mobile (smartphone). Artinya, jika website toko online Anda lambat dibuka di handphone, Anda dipastikan kehilangan pembeli potensial. Optimasi gambar toko Anda sekarang juga!',
      metaDescription: 'In-depth analysis of Q3 e-commerce trends, highlighting mobile shopping and e-wallet payments.',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=1200',
    },
  ];

  useEffect(() => {
    fetchBlogDetail();
    // Scroll to top on navigation
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await axios.get(`${BACKEND_URL}/api/blogs/${slug}`);
      if (response.data && response.data.data) {
        setBlog(response.data.data);
      } else {
        findFallback();
      }
    } catch (err) {
      console.warn(`Could not fetch details for ${slug} from backend. Attempting local search...`, err);
      findFallback();
    } finally {
      setLoading(false);
    }
  };

  const findFallback = () => {
    const localPost = fallbackBlogs.find(b => b.slug === slug);
    if (localPost) {
      setBlog(localPost);
    } else {
      setError(true);
    }
  };

  // Dynamically inject SEO Tags
  useEffect(() => {
    if (blog) {
      document.title = `${blog.title} | DagangCommerce Blog`;
      
      // Update meta description if it exists
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', blog.meta_description || blog.metaDescription || blog.title);
    }

    return () => {
      document.title = 'DagangCommerce | Pembuat Website Toko Online Mudah & Cepat';
    };
  }, [blog]);

  if (loading) {
    return (
      <div className="min-h-screen py-24 bg-surface-container-lowest animate-pulse">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <div className="h-6 bg-surface-container rounded-lg w-1/4"></div>
          <div className="h-12 bg-surface-container rounded-lg w-3/4"></div>
          <div className="h-4 bg-surface-container rounded-lg w-1/3"></div>
          <div className="aspect-video bg-surface-container rounded-2xl w-full"></div>
          <div className="space-y-3 pt-6">
            <div className="h-4 bg-surface-container rounded-lg w-full"></div>
            <div className="h-4 bg-surface-container rounded-lg w-full"></div>
            <div className="h-4 bg-surface-container rounded-lg w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen py-32 bg-surface-container-lowest flex items-center justify-center text-center px-6">
        <div className="max-w-md space-y-6">
          <span className="material-symbols-outlined text-[80px] text-error select-none">find_in_page</span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Artikel Tidak Ditemukan</h2>
          <p className="font-body-lg text-body-lg text-secondary">
            Maaf, artikel blog yang Anda cari tidak tersedia atau telah dihapus.
          </p>
          <div>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#001A3D] text-white hover:opacity-90 font-bold rounded-xl transition-all shadow-md no-underline"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen py-24 bg-surface-container-lowest">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center gap-2">
          <Link to="/" className="text-secondary hover:text-primary text-sm font-semibold flex items-center gap-1 no-underline">
            <span className="material-symbols-outlined text-[16px]">home</span>
            Home
          </Link>
          <span className="text-outline text-sm">/</span>
          <span className="text-primary text-sm font-bold bg-secondary-container px-2.5 py-0.5 rounded-full">
            {blog.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-headline-lg text-[2.5rem] leading-tight text-on-surface mb-6 font-bold">
          {blog.title}
        </h1>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-secondary border-b border-outline-variant/30 pb-6 mb-8 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-outline">calendar_today</span>
            {blog.date}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-outline">person</span>
            Oleh Tim DagangCommerce
          </span>
        </div>

        {/* Hero Cover Image */}
        {blog.thumbnail && (
          <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-md border border-outline-variant/20 bg-surface-container select-none">
            <img 
              src={blog.thumbnail} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Content Body */}
        <div className="prose max-w-none font-body-lg text-body-lg text-on-surface-variant leading-relaxed space-y-6">
          {blog.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="whitespace-pre-wrap">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Back Link */}
        <div className="mt-16 pt-8 border-t border-outline-variant/30 flex justify-between items-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary hover:text-secondary font-bold no-underline"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Kembali ke Beranda
          </Link>
          
          <button 
            onClick={() => window.share ? window.share() : navigator.clipboard.writeText(window.location.href).then(() => alert('Link artikel disalin!'))}
            className="flex items-center gap-1.5 px-4 py-2 border border-outline-variant hover:bg-surface-container rounded-xl text-xs font-bold text-on-surface-variant transition-colors bg-transparent cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">share</span>
            Bagikan Artikel
          </button>
        </div>

      </div>
    </article>
  );
}

export default BlogDetailPage;
