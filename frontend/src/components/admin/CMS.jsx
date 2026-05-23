import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8000';

function CMS() {
  const [loading, setLoading] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [blogEditMode, setBlogEditMode] = useState(false);
  const [faqEditMode, setFaqEditMode] = useState(false);

  // --- Stateful Data Models ---
  
  // 1. Blog Posts State
  const [blogs, setBlogs] = useState([]);

  const [currentBlog, setCurrentBlog] = useState({
    id: null,
    title: '',
    slug: '',
    category: 'Release Notes',
    status: 'Draft',
    date: '',
    content: '',
    metaDescription: '',
    metaKeywords: '',
    thumbnail: '',
  });

  // 2. Testimonials State
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: 'Sarah Jenkins',
      company: 'TechGadgets Co.',
      rating: 5,
      text: 'DagangMaker transformed our operational workflow. The new inventory sync feature saved us countless hours.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7BLb2os7k6XgTzXams9D8uMCICYR3ADJbrkaeUWswemND7oJ_BGIqC7Q4hEK-GHdOcD3fEYG4G9cE_AgKa2P80IZhp_ZC-E0SHOlIhy8AmGpbYTCBOr9MTopNOj11VWaPCac-Z8_FSLJPzhHg-isw9ciRHrFCOfYewzzWk_ZPYheNmS3UfDG5wH4u_LTu_OQRoOf_ZvBuBeYJV1V0lzcabsHxgzH6WEVuWhkmrV8-502HZIHhTcV7VrUm5iouEKrWnF1Foq0GT0pa',
      status: 'pending',
    },
    {
      id: 2,
      name: 'Marcus Chen',
      company: 'Global Logistics',
      rating: 4,
      text: 'Solid platform with great uptime. Support could be slightly faster during weekends, but overall highly satisfied.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW0AlwKmIxhdQ8P-03okycezQzw13V5Bq3lgWw-4XEq-1jlcYqaXKlsKbF2CJqv_LopQelgZhuOKhzSQORSOzi5gFn-JnIF1a1ixJkX5jPMy-UZ-k0MiYLQYVvFJ0nBFu78neZoHvcBGNlKc37ZfR1GXGkvuqyAD9aK2eFJPQ_y6Z0bn3U_MBX6H5youYcKqNwRJCf0SQ0TYl1sMu4BqFl6QgfnZHp31CZ2pGTUUehgv8TFu32x5aBBLFyJrMJafrdUOXCHUqAkVOJ',
      status: 'pending',
    },
  ]);

  const [activeTestimonialTab, setActiveTestimonialTab] = useState('pending'); // pending | approved | rejected

  // 3. FAQs State
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: 'What is the pricing model?',
      answer: 'Our pricing is tiered based on transaction volume and required features. We offer flexible options designed for startups up to corporate scale.',
    },
    {
      id: 2,
      question: 'How long is the setup process?',
      answer: 'Standard integration takes roughly 2-3 business days depending on your existing infrastructure and templates selected.',
    },
    {
      id: 3,
      question: 'Do you support international payments?',
      answer: 'Yes, we support over 150 currencies and integrate with major global payment gateways like Stripe, PayPal, and local FPX methods.',
    },
  ]);

  const [currentFaq, setCurrentFaq] = useState({
    id: null,
    question: '',
    answer: '',
  });

  // 4. System Status State
  const [lastChecked, setLastChecked] = useState('Just now');
  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${BACKEND_URL}/api/admin/blogs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.data) {
        const mapped = response.data.data.map(b => ({
          ...b,
          metaDescription: b.meta_description || b.metaDescription || '',
          metaKeywords: b.meta_keywords || b.metaKeywords || '',
        }));
        setBlogs(mapped);
      }
    } catch (error) {
      console.error('Failed to fetch admin blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStatus = () => {
    setIsRefreshingStatus(true);
    setTimeout(() => {
      setIsRefreshingStatus(false);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastChecked(`at ${timeStr}`);
    }, 1000);
  };

  // --- Blog Event Handlers ---
  const handleOpenNewBlog = () => {
    setBlogEditMode(false);
    setCurrentBlog({
      id: null,
      title: '',
      slug: '',
      category: 'Release Notes',
      status: 'Draft',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      content: '',
      metaDescription: '',
      metaKeywords: '',
      thumbnail: '',
    });
    setIsBlogModalOpen(true);
  };

  const handleOpenEditBlog = (blog) => {
    setBlogEditMode(true);
    setCurrentBlog({ ...blog });
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    if (!currentBlog.title.trim()) return;

    try {
      const token = localStorage.getItem('admin_token');
      const payload = {
        title: currentBlog.title,
        slug: currentBlog.slug,
        category: currentBlog.category,
        status: currentBlog.status,
        content: currentBlog.content,
        meta_description: currentBlog.metaDescription || currentBlog.meta_description || '',
        meta_keywords: currentBlog.metaKeywords || currentBlog.meta_keywords || '',
        thumbnail: currentBlog.thumbnail || '',
        date: currentBlog.date || '',
      };

      if (blogEditMode) {
        const response = await axios.put(`${BACKEND_URL}/api/admin/blogs/${currentBlog.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.data) {
          const updated = {
            ...response.data.data,
            metaDescription: response.data.data.meta_description || '',
            metaKeywords: response.data.data.meta_keywords || '',
          };
          setBlogs(prev => prev.map(b => b.id === currentBlog.id ? updated : b));
        }
      } else {
        const response = await axios.post(`${BACKEND_URL}/api/admin/blogs`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.data) {
          const created = {
            ...response.data.data,
            metaDescription: response.data.data.meta_description || '',
            metaKeywords: response.data.data.meta_keywords || '',
          };
          setBlogs(prev => [...prev, created]);
        }
      }
      setIsBlogModalOpen(false);
    } catch (error) {
      console.error('Failed to save blog:', error);
      alert(error.response?.data?.message || 'Failed to save blog post');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const token = localStorage.getItem('admin_token');
        await axios.delete(`${BACKEND_URL}/api/admin/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBlogs(prev => prev.filter(b => b.id !== id));
      } catch (error) {
        console.error('Failed to delete blog:', error);
        alert(error.response?.data?.message || 'Failed to delete blog post');
      }
    }
  };

  // --- Testimonial Event Handlers ---
  const handleApproveTestimonial = (id) => {
    setTestimonials(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'approved' } : t))
    );
  };

  const handleRejectTestimonial = (id) => {
    setTestimonials(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'rejected' } : t))
    );
  };

  const handleDeleteTestimonial = (id) => {
    if (window.confirm('Delete this feedback entry?')) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
    }
  };

  // --- FAQ Event Handlers ---
  const handleOpenNewFaq = () => {
    setFaqEditMode(false);
    setCurrentFaq({ id: null, question: '', answer: '' });
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (faq) => {
    setFaqEditMode(true);
    setCurrentFaq({ ...faq });
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = (e) => {
    e.preventDefault();
    if (!currentFaq.question.trim() || !currentFaq.answer.trim()) return;

    if (faqEditMode) {
      setFaqs(prev => prev.map(f => f.id === currentFaq.id ? currentFaq : f));
    } else {
      const newId = faqs.length > 0 ? Math.max(...faqs.map(f => f.id)) + 1 : 1;
      setFaqs(prev => [...prev, { ...currentFaq, id: newId }]);
    }
    setIsFaqModalOpen(false);
  };

  const handleDeleteFaq = (id) => {
    if (window.confirm('Delete this FAQ item?')) {
      setFaqs(prev => prev.filter(f => f.id !== id));
    }
  };

  const moveFaq = (index, direction) => {
    const updatedFaqs = [...faqs];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;
    
    // Swap elements
    const temp = updatedFaqs[index];
    updatedFaqs[index] = updatedFaqs[targetIndex];
    updatedFaqs[targetIndex] = temp;
    setFaqs(updatedFaqs);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
        <span className="text-secondary text-sm font-semibold">Memuat Panel CMS...</span>
      </div>
    );
  }

  // Filtered Testimonials
  const filteredTestimonials = testimonials.filter(t => t.status === activeTestimonialTab);

  return (
    <div className="bg-background text-on-surface antialiased overflow-hidden flex h-screen">
      <Sidebar onLogout={() => console.log('Logout called')} />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <TopNav title="CMS Konten Publik" />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto mt-16 p-6 md:p-10 bg-background">
          <div className="max-w-[1440px] mx-auto space-y-6 pb-12">
            
            {/* Page Title Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">CMS Konten</h2>
                <p className="text-base text-on-surface-variant mt-1">Kelola artikel blog publik, ulasan pembeli, dan informasi bantuan.</p>
              </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left & Middle Column (Col span 2) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Blog Post Manager Card */}
                <section className="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  <div className="p-6 border-b border-surface-variant flex justify-between items-center bg-surface-container-low">
                    <div>
                      <h3 className="text-lg font-bold text-primary">Blog Post Manager</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">Kelola semua artikel pengumuman dan panduan publik.</p>
                    </div>
                    <button 
                      onClick={handleOpenNewBlog}
                      className="bg-[#001A3D] text-white hover:bg-[#001A3D]/90 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      <span>New Post</span>
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low/50 text-xs text-on-surface-variant font-semibold border-b border-surface-variant">
                          <th className="py-4 px-6">Title</th>
                          <th className="py-4 px-6">Category</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6">Date</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-on-surface">
                        {blogs.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-on-surface-variant">
                              Tidak ada artikel blog. Silakan buat baru.
                            </td>
                          </tr>
                        ) : (
                          blogs.map((blog) => (
                            <tr key={blog.id} className="hover:bg-surface/50 transition-colors border-b border-surface-variant last:border-0">
                              <td className="py-4 px-6 font-semibold text-primary max-w-xs truncate" title={blog.title}>
                                {blog.title}
                              </td>
                              <td className="py-4 px-6 text-on-surface-variant">{blog.category}</td>
                              <td className="py-4 px-6">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  blog.status === 'Published' 
                                    ? 'bg-secondary-fixed text-on-secondary-fixed' 
                                    : blog.status === 'Draft'
                                    ? 'bg-surface-container-high text-on-surface-variant'
                                    : 'bg-tertiary-fixed text-on-tertiary-fixed'
                                }`}>
                                  {blog.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-on-surface-variant">{blog.date}</td>
                              <td className="py-4 px-6 text-right space-x-2">
                                <button 
                                  onClick={() => handleOpenEditBlog(blog)}
                                  className="text-outline hover:text-primary transition-colors inline-flex items-center p-1 rounded-md hover:bg-surface-container"
                                >
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                                <button 
                                  onClick={() => handleDeleteBlog(blog.id)}
                                  className="text-error/70 hover:text-error transition-colors inline-flex items-center p-1 rounded-md hover:bg-error-container"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* 2. Testimonial Queue Card */}
                <section className="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-primary">Testimonial Queue</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">Tinjau dan setujui ulasan pembeli untuk ditampilkan di beranda.</p>
                    </div>
                    
                    {/* Status Tabs */}
                    <div className="flex bg-surface-container rounded-lg p-0.5 gap-1 border border-outline-variant/30 text-xs">
                      {['pending', 'approved', 'rejected'].map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveTestimonialTab(tab)}
                          className={`px-3 py-1.5 rounded-md font-semibold capitalize transition-all ${
                            activeTestimonialTab === tab 
                              ? 'bg-white text-primary shadow-sm' 
                              : 'text-on-surface-variant hover:text-primary'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grid Cards Container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTestimonials.length === 0 ? (
                      <div className="col-span-2 py-8 border border-dashed border-outline-variant/60 rounded-xl bg-surface-container-low text-center text-sm text-on-surface-variant">
                        Tidak ada ulasan dalam kategori <span className="font-bold capitalize">"{activeTestimonialTab}"</span>.
                      </div>
                    ) : (
                      filteredTestimonials.map((testi) => (
                        <div key={testi.id} className="border border-surface-variant rounded-xl p-4 bg-surface-container-lowest hover:shadow-md transition-shadow flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border border-outline-variant">
                                  <img alt={testi.name} className="w-full h-full object-cover" src={testi.avatar} />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-primary">{testi.name}</h4>
                                  <p className="text-xs text-on-surface-variant">{testi.company}</p>
                                </div>
                              </div>
                              <div className="flex gap-0.5 text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                  <span 
                                    key={i} 
                                    className={`material-symbols-outlined text-[16px] ${i < testi.rating ? 'fill' : ''}`}
                                    style={{ fontVariationSettings: i < testi.rating ? "'FILL' 1" : "'FILL' 0" }}
                                  >
                                    star
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-on-surface leading-relaxed mb-4 italic">
                              "{testi.text}"
                            </p>
                          </div>
                          
                          <div className="flex justify-end gap-2 pt-3 border-t border-surface-variant/40 mt-auto">
                            {testi.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleRejectTestimonial(testi.id)}
                                  className="px-3 py-1.5 rounded-lg border border-error/20 text-error hover:bg-error-container hover:border-transparent text-xs font-semibold transition-all active:scale-95"
                                >
                                  Reject
                                </button>
                                <button 
                                  onClick={() => handleApproveTestimonial(testi.id)}
                                  className="px-3 py-1.5 rounded-lg bg-[#001A3D] text-white hover:opacity-90 text-xs font-semibold transition-all active:scale-95"
                                >
                                  Approve
                                </button>
                              </>
                            )}
                            {testi.status !== 'pending' && (
                              <button 
                                onClick={() => handleDeleteTestimonial(testi.id)}
                                className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:text-error hover:bg-error-container hover:border-transparent text-xs font-semibold transition-all active:scale-95"
                              >
                                Delete Feedback
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>

              {/* Right Column (Col span 1) */}
              <div className="space-y-6">
                
                {/* 3. System Status Card */}
                <section className="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-sm p-6 relative overflow-hidden hover:shadow-md transition-shadow">
                  <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-green-500 bg-green-50 p-2 rounded-full ring-4 ring-green-500/10" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                      <div>
                        <h3 className="text-md font-bold text-primary">System Status</h3>
                        <p className="text-xs text-on-surface-variant">Semua sistem publik aktif.</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleRefreshStatus}
                      className={`p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant transition-all ${isRefreshingStatus ? 'animate-spin text-secondary' : ''}`}
                      disabled={isRefreshingStatus}
                      title="Perbarui Status"
                    >
                      <span className="material-symbols-outlined text-[20px]">refresh</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-sm border-b border-surface-variant/40 pb-2">
                      <span className="text-on-surface font-medium">Main Website</span>
                      <span className="font-semibold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full text-xs">99.9% Uptime</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-surface-variant/40 pb-2">
                      <span className="text-on-surface font-medium">API Gateway</span>
                      <span className="font-semibold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full text-xs">100.0% Uptime</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-on-surface-variant">Terakhir dicek: <span className="font-semibold">{lastChecked}</span></span>
                      <span className="text-secondary font-semibold hover:underline cursor-pointer flex items-center gap-0.5">
                        Logs
                        <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </section>

                {/* 4. Landing FAQ Management */}
                <section className="bg-surface-container-lowest rounded-xl border border-surface-variant shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>quiz</span>
                      <h3 className="text-lg font-bold text-primary">Landing FAQ</h3>
                    </div>
                    <button 
                      onClick={handleOpenNewFaq}
                      className="text-[#001A3D] hover:bg-surface-container p-1.5 rounded-lg border border-outline-variant transition-colors flex items-center justify-center active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
                    {faqs.map((faq, index) => (
                      <div 
                        key={faq.id} 
                        className="border border-surface-variant rounded-xl p-3.5 hover:border-[#001A3D]/40 transition-all bg-surface-container-low/40 group flex flex-col justify-between"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 cursor-pointer" onClick={() => handleOpenEditFaq(faq)}>
                            <h4 className="text-sm font-bold text-primary group-hover:text-[#0453cd] transition-colors pr-2 leading-tight">
                              {faq.question}
                            </h4>
                            <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed line-clamp-2">
                              {faq.answer}
                            </p>
                          </div>
                          
                          {/* Ordering Up/Down controls */}
                          <div className="flex flex-col gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => moveFaq(index, -1)}
                              disabled={index === 0}
                              className="text-on-surface-variant hover:text-primary disabled:opacity-20 disabled:pointer-events-none p-0.5 hover:bg-surface rounded"
                            >
                              <span className="material-symbols-outlined text-[16px]">expand_less</span>
                            </button>
                            <button 
                              onClick={() => moveFaq(index, 1)}
                              disabled={index === faqs.length - 1}
                              className="text-on-surface-variant hover:text-primary disabled:opacity-20 disabled:pointer-events-none p-0.5 hover:bg-surface rounded"
                            >
                              <span className="material-symbols-outlined text-[16px]">expand_more</span>
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-surface-variant/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleOpenEditFaq(faq)}
                            className="text-xs font-semibold text-secondary hover:underline"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteFaq(faq.id)}
                            className="text-xs font-semibold text-error hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-surface-container-low/50 rounded-lg border border-outline-variant/20">
                    <p className="text-[11px] text-on-surface-variant leading-relaxed flex gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-secondary">info</span>
                      Gunakan tombol panah di sudut kanan tiap item untuk menyusun urutan FAQ publik.
                    </p>
                  </div>
                </section>
              </div>

            </div>
          </div>
        </main>
      </div>

      {/* --- MODAL DIALOGS --- */}

      {/* 1. Blog Post Modal */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl border border-surface-variant max-w-5xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-surface-variant bg-surface-container-low flex justify-between items-center">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">edit_document</span>
                {blogEditMode ? 'Edit Blog Post' : 'Create New Post'}
              </h3>
              <button 
                onClick={() => setIsBlogModalOpen(false)}
                className="text-on-surface-variant hover:text-primary hover:bg-surface-container p-1 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSaveBlog}>
              <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar bg-surface-container-lowest">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column: Content (2 columns wide) */}
                  <div className="lg:col-span-2 space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Article Title</label>
                      <input
                        type="text"
                        required
                        value={currentBlog.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                          setCurrentBlog(prev => ({ ...prev, title, slug }));
                        }}
                        className="w-full px-4 py-2.5 border border-outline-variant rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm font-semibold bg-surface"
                        placeholder="Contoh: Platform Update 2.4..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">URL Slug</label>
                      <div className="flex items-center">
                        <span className="px-3 py-2.5 border border-r-0 border-outline-variant rounded-l-lg bg-surface-container-low text-on-surface-variant text-sm font-medium">/blog/</span>
                        <input
                          type="text"
                          required
                          value={currentBlog.slug}
                          onChange={(e) => setCurrentBlog(prev => ({ ...prev, slug: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-outline-variant rounded-r-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm bg-surface font-mono text-primary"
                          placeholder="platform-update-2-4"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Article Content</label>
                      <div className="border border-outline-variant rounded-lg overflow-hidden focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all">
                        <div className="bg-surface-container-low border-b border-outline-variant/50 p-2 flex gap-1">
                          {/* Rich Text Editor Mock Toolbar */}
                          <button type="button" className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant"><span className="material-symbols-outlined text-[16px]">format_bold</span></button>
                          <button type="button" className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant"><span className="material-symbols-outlined text-[16px]">format_italic</span></button>
                          <div className="w-px h-6 bg-outline-variant/50 mx-1 my-auto"></div>
                          <button type="button" className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant"><span className="material-symbols-outlined text-[16px]">format_list_bulleted</span></button>
                          <button type="button" className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant"><span className="material-symbols-outlined text-[16px]">format_list_numbered</span></button>
                          <div className="w-px h-6 bg-outline-variant/50 mx-1 my-auto"></div>
                          <button type="button" className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant"><span className="material-symbols-outlined text-[16px]">link</span></button>
                          <button type="button" className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant"><span className="material-symbols-outlined text-[16px]">image</span></button>
                        </div>
                        <textarea
                          required
                          rows="14"
                          value={currentBlog.content}
                          onChange={(e) => setCurrentBlog(prev => ({ ...prev, content: e.target.value }))}
                          className="w-full px-4 py-3 bg-surface focus:outline-none text-sm custom-scrollbar leading-relaxed"
                          placeholder="Tulis detail artikel di sini... (Mendukung Markdown/HTML)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: SEO & Settings (1 column wide) */}
                  <div className="space-y-5">
                    {/* Publication Settings */}
                    <div className="p-5 bg-surface rounded-xl border border-outline-variant shadow-sm space-y-4">
                      <h4 className="text-sm font-bold text-primary flex items-center gap-2 border-b border-outline-variant/50 pb-2 mb-4">
                        <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
                        Publish Settings
                      </h4>
                      
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Category</label>
                        <select
                          value={currentBlog.category}
                          onChange={(e) => setCurrentBlog(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm bg-surface-container-lowest"
                        >
                          <option value="Release Notes">Release Notes</option>
                          <option value="Guides">Guides</option>
                          <option value="Industry Insights">Industry Insights</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Status</label>
                        <select
                          value={currentBlog.status}
                          onChange={(e) => setCurrentBlog(prev => ({ ...prev, status: e.target.value }))}
                          className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm bg-surface-container-lowest"
                        >
                          <option value="Published">Published</option>
                          <option value="Draft">Draft</option>
                          <option value="In Review">In Review</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Thumbnail URL</label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={currentBlog.thumbnail}
                            onChange={(e) => setCurrentBlog(prev => ({ ...prev, thumbnail: e.target.value }))}
                            className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm bg-surface-container-lowest"
                            placeholder="https://example.com/image.jpg"
                          />
                          <button type="button" className="px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-low hover:bg-surface-variant text-on-surface-variant transition-colors">
                            <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                          </button>
                        </div>
                        {currentBlog.thumbnail && (
                          <div className="mt-3 aspect-video rounded-lg overflow-hidden border border-outline-variant/50 bg-surface-container">
                            <img src={currentBlog.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SEO Meta Box */}
                    <div className="p-5 bg-surface rounded-xl border border-outline-variant shadow-sm space-y-4">
                      <h4 className="text-sm font-bold text-primary flex items-center gap-2 border-b border-outline-variant/50 pb-2 mb-4">
                        <span className="material-symbols-outlined text-[18px] text-secondary">search</span>
                        Search Engine Optimization
                      </h4>
                      
                      <div>
                        <label className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Meta Description</span>
                          <span className={`text-[10px] font-bold ${currentBlog.metaDescription?.length > 160 ? 'text-error' : 'text-outline'}`}>
                            {currentBlog.metaDescription?.length || 0}/160
                          </span>
                        </label>
                        <textarea
                          rows="3"
                          value={currentBlog.metaDescription}
                          onChange={(e) => setCurrentBlog(prev => ({ ...prev, metaDescription: e.target.value }))}
                          className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm custom-scrollbar bg-surface-container-lowest"
                          placeholder="Ringkasan singkat untuk mesin pencari..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Meta Keywords</label>
                        <input
                          type="text"
                          value={currentBlog.metaKeywords}
                          onChange={(e) => setCurrentBlog(prev => ({ ...prev, metaKeywords: e.target.value }))}
                          className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm bg-surface-container-lowest"
                          placeholder="ecommerce, guide, update (pisahkan dengan koma)"
                        />
                      </div>
                      
                      <div className="mt-3 p-3 bg-[#f0f9ff] text-[#0369a1] border border-[#bae6fd] rounded-lg text-xs font-medium leading-relaxed">
                        <span className="font-bold flex items-center gap-1 mb-1">
                          <span className="material-symbols-outlined text-[14px]">lightbulb</span>
                          SEO Tips:
                        </span>
                        Gunakan Meta Description di bawah 160 karakter agar tidak terpotong di hasil pencarian Google. Pastikan menyertakan kata kunci utama Anda.
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>

              <div className="p-6 border-t border-surface-variant bg-surface-container-low flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-5 py-2.5 border border-outline-variant text-on-surface-variant hover:bg-surface-container text-sm font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#001A3D] text-white hover:opacity-90 text-sm font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">cloud_done</span>
                  {blogEditMode ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. FAQ Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl border border-surface-variant max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-surface-variant bg-surface-container-low flex justify-between items-center">
              <h3 className="text-lg font-bold text-primary">
                {faqEditMode ? 'Edit FAQ Item' : 'Add New FAQ'}
              </h3>
              <button 
                onClick={() => setIsFaqModalOpen(false)}
                className="text-on-surface-variant hover:text-primary hover:bg-surface-container p-1 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSaveFaq}>
              <div className="p-6 space-y-4">
                {/* Question */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Pertanyaan (Question)</label>
                  <input
                    type="text"
                    required
                    value={currentFaq.question}
                    onChange={(e) => setCurrentFaq(prev => ({ ...prev, question: e.target.value }))}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-[#001A3D] text-sm"
                    placeholder="Contoh: Apakah bisa dikustomisasi?"
                  />
                </div>

                {/* Answer */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Jawaban (Answer)</label>
                  <textarea
                    required
                    rows="4"
                    value={currentFaq.answer}
                    onChange={(e) => setCurrentFaq(prev => ({ ...prev, answer: e.target.value }))}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-[#001A3D] text-sm custom-scrollbar"
                    placeholder="Tulis jawaban lengkap penjelasan FAQ..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-surface-variant bg-surface-container-low flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container text-sm font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#001A3D] text-white hover:opacity-90 text-sm font-semibold rounded-lg transition-all shadow-sm"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CMS;
