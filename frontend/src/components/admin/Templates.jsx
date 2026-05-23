import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8000';

function Templates() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');
  
  // Modal and Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // File Upload State
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [customFolderName, setCustomFolderName] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [thumbnailSourceType, setThumbnailSourceType] = useState('file'); // file | url
  const [demoSourceType, setDemoSourceType] = useState('file'); // file | url

  // Form fields state
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'Restaurant',
    price: '',
    status: 'Active',
    version: 'v1.0.0',
    image: '',
    demoUrl: '',
    description: ''
  });

  const [toastMessage, setToastMessage] = useState(null);

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start
      .replace(/-+$/, '');            // Trim - from end
  };

  const uploadFiles = async (folderSlug) => {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('folder_name', folderSlug);
    
    if (thumbnailSourceType === 'file' && thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }
    if (demoSourceType === 'file' && zipFile) {
      formData.append('zip_file', zipFile);
    }

    const response = await axios.post(`${BACKEND_URL}/api/admin/templates/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchTemplates();
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${BACKEND_URL}/api/admin/templates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data && response.data.data) {
        setTemplates(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch admin templates:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
      } else {
        triggerToast('Error fetching templates from server.');
      }
    } finally {
      setLoading(false);
    }
  };

  // derived calculations for Bento KPI Stats
  const totalSalesCount = templates.reduce((sum, t) => sum + (t.sales || 0), 0);
  const totalTemplatesCount = templates.length;
  const activeTemplatesCount = templates.filter(t => t.status === 'Active').length;

  // Add Template Callback
  const handleAddTemplate = async (e) => {
    e.preventDefault();
    if (!newTemplate.name.trim() || !newTemplate.price) {
      triggerToast('Please fill out all required fields.');
      return;
    }

    try {
      setUploadingFiles(true);
      const folderSlug = customFolderName.trim() || slugify(newTemplate.name);
      
      let uploadedImage = newTemplate.image;
      let uploadedDemo = newTemplate.demoUrl;

      // Perform upload first if files are present
      if ((thumbnailSourceType === 'file' && thumbnailFile) || (demoSourceType === 'file' && zipFile)) {
        triggerToast('Uploading template files and unzipping source package...');
        const uploadRes = await uploadFiles(folderSlug);
        if (uploadRes.thumbnailUrl) {
          uploadedImage = uploadRes.thumbnailUrl;
        }
        if (uploadRes.demoUrl) {
          uploadedDemo = uploadRes.demoUrl;
        }
      }

      // Fallback relative demo path if zip was uploaded but server URL resolution missed
      if (demoSourceType === 'file' && zipFile && !uploadedDemo) {
        uploadedDemo = `http://localhost:5173/demos/${folderSlug}/index.html`;
      }

      const token = localStorage.getItem('admin_token');
      const response = await axios.post(`${BACKEND_URL}/api/admin/templates`, {
        name: newTemplate.name,
        category: newTemplate.category,
        price: parseFloat(newTemplate.price),
        status: newTemplate.status,
        version: newTemplate.version || 'v1.0.0',
        image: uploadedImage || '',
        demoUrl: uploadedDemo || '',
        description: newTemplate.description || ''
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.data) {
        setTemplates([response.data.data, ...templates]);
        setShowAddModal(false);
        // reset form & files
        setNewTemplate({
          name: '',
          category: 'Restaurant',
          price: '',
          status: 'Active',
          version: 'v1.0.0',
          image: '',
          demoUrl: '',
          description: ''
        });
        setThumbnailFile(null);
        setZipFile(null);
        setCustomFolderName('');
        triggerToast(`Template "${response.data.data.name}" created and deployed successfully!`);
      }
    } catch (error) {
      console.error('Failed to create template/upload:', error);
      triggerToast('Failed to upload files or register template. Please check file format.');
    } finally {
      setUploadingFiles(false);
    }
  };

  // Edit Template Callback
  const handleSaveEditTemplate = async (e) => {
    e.preventDefault();
    if (!editingTemplate.name.trim() || !editingTemplate.price) {
      triggerToast('Please enter valid template information.');
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.put(`${BACKEND_URL}/api/admin/templates/${editingTemplate.id}`, {
        name: editingTemplate.name,
        category: editingTemplate.category,
        price: parseFloat(editingTemplate.price),
        status: editingTemplate.status,
        version: editingTemplate.version || 'v1.0.0',
        image: editingTemplate.image || '',
        demoUrl: editingTemplate.demoUrl || '',
        description: editingTemplate.description || ''
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.data) {
        setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? response.data.data : t));
        setShowEditModal(false);
        setEditingTemplate(null);
        triggerToast(`Template "${editingTemplate.name}" updated successfully!`);
      }
    } catch (error) {
      console.error('Failed to update template:', error);
      triggerToast('Failed to update template.');
    }
  };

  // Delete Template Callback
  const handleDeleteTemplate = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete template "${name}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${BACKEND_URL}/api/admin/templates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(prev => prev.filter(t => t.id !== id));
      triggerToast(`Template "${name}" deleted.`);
    } catch (error) {
      console.error('Failed to delete template:', error);
      triggerToast('Failed to delete template.');
    }
  };

  // Filters search and tab
  const filteredTemplates = templates.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.version && t.version.toLowerCase().includes(searchQuery.toLowerCase()));
      
    if (selectedStatusTab === 'All') return matchesSearch;
    return matchesSearch && t.status === selectedStatusTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
        <span className="text-secondary text-sm font-semibold">Memuat Katalog Template...</span>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface antialiased overflow-hidden flex h-screen w-full">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
        <TopNav title="Katalog Template" />

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[9999] bg-[#001A3D] text-white px-5 py-3.5 rounded-xl border border-white/10 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
            <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto mt-16 p-6 md:p-10 bg-background">
          <div className="max-w-[1440px] mx-auto space-y-8 pb-12">
            
            {/* Header section */}
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary">Katalog Template</h2>
                <p className="text-sm text-on-surface-variant mt-1.5">Manage, deploy, and analyze your marketplace templates.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-primary/95 transition-all active:scale-95 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Add New Template
              </button>
            </div>

            {/* Executive Bento Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Stat 1 */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-container-low rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Templates</span>
                  <span className="material-symbols-outlined text-outline">grid_view</span>
                </div>
                <h3 className="text-3xl font-bold text-primary">{totalTemplatesCount}</h3>
                <div className="mt-2 flex items-center gap-1 text-secondary font-semibold text-[11px]">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>{activeTemplatesCount} Active Templates</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-container-low rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Downloads / Sales</span>
                  <span className="material-symbols-outlined text-outline">payments</span>
                </div>
                <h3 className="text-3xl font-bold text-primary">{totalSalesCount.toLocaleString('id-ID')}</h3>
                <div className="mt-2 flex items-center gap-1 text-secondary font-semibold text-[11px]">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span>Direct One-Time Purchases</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-surface-container-low rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active Categories</span>
                  <span className="material-symbols-outlined text-outline">star_half</span>
                </div>
                <h3 className="text-3xl font-bold text-primary">
                  {new Set(templates.map(t => t.category)).size}
                </h3>
                <div className="mt-2 text-on-surface-variant font-semibold text-[11px]">
                  <span>Diverse industry frameworks</span>
                </div>
              </div>

            </div>

            {/* Data Table Catalog */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
              
              {/* Toolbar */}
              <div className="p-4 border-b border-outline-variant/30 bg-surface-bright flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                
                {/* Search query input */}
                <div className="relative w-64">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[16px]">search</span>
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 bg-surface border border-outline-variant rounded-full text-xs font-semibold focus:outline-none focus:border-secondary transition-all"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={selectedStatusTab}
                    onChange={(e) => setSelectedStatusTab(e.target.value)}
                    className="px-3 py-1.5 border border-outline-variant rounded-lg text-xs font-semibold bg-surface focus:outline-none"
                  >
                    <option value="All">All States</option>
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>

                  <span className="text-[11px] text-on-surface-variant font-semibold">
                    Showing 1-{filteredTemplates.length} of {templates.length}
                  </span>
                </div>

              </div>

              {/* Table content */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low">
                    <tr className="border-b border-outline-variant/30">
                      <th className="py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Template Name</th>
                      <th className="py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Category</th>
                      <th className="py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Price</th>
                      <th className="py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Sales</th>
                      <th className="py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                      <th className="py-3 px-6 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-xs font-medium">
                    {filteredTemplates.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-20 text-xs font-semibold text-on-surface-variant">
                          No matching templates registered.
                        </td>
                      </tr>
                    ) : (
                      filteredTemplates.map((t) => (
                        <tr 
                          key={t.id}
                          className="hover:bg-surface-container-low/40 transition-colors group cursor-pointer"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              {t.image && (
                                <img src={t.image} alt={t.name} className="w-8 h-8 rounded object-cover border border-outline-variant/30" />
                              )}
                              <div>
                                <p className="text-xs font-bold text-primary group-hover:text-[#0453cd] transition-colors">{t.name}</p>
                                <p className="text-[10px] text-outline font-semibold mt-0.5">{t.version || 'v1.0.0'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary-container/10 text-secondary text-[10px] font-bold uppercase tracking-wide">
                              {t.category}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right font-bold text-primary">
                            Rp {t.price.toLocaleString('id-ID')}
                          </td>
                          <td className="py-4 px-6 text-right font-bold text-on-surface-variant">
                            {(t.sales || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border border-outline-variant/20 bg-surface-container ${
                              t.status === 'Active' ? 'text-[#0453cd]' : 'text-outline/70'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'Active' ? 'bg-[#0453cd]' : 'bg-outline'}`}></span>
                              {t.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              {t.demoUrl && (
                                <a 
                                  href={t.demoUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-1 hover:bg-surface-container rounded text-outline hover:text-[#0453cd] transition-colors"
                                  title="Live Preview"
                                >
                                  <span className="material-symbols-outlined text-[16px]">visibility</span>
                                </a>
                              )}
                              <button
                                onClick={() => {
                                  setEditingTemplate(t);
                                  setShowEditModal(true);
                                }}
                                className="p-1 hover:bg-surface-container rounded text-on-surface-variant hover:text-secondary transition-colors"
                              >
                                <span className="material-symbols-outlined text-[16px]">edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteTemplate(t.id, t.name)}
                                className="p-1 hover:bg-error-container rounded text-outline hover:text-error transition-colors"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* --- ADD NEW TEMPLATE MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-150 overflow-y-auto max-h-[90vh]">
            
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-outline-variant/20">
              <h3 className="text-base font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">add_to_photos</span>
                Register New Template
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-surface-container rounded-full text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Template Name</label>
                <input
                  type="text"
                  required
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="e.g. Nexus Dashboard SaaS"
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary"
                  >
                    <option value="Restaurant">Restaurant</option>
                    <option value="Salon">Salon</option>
                    <option value="Online Store">Online Store</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Dashboard">Dashboard</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Portfolio">Portfolio</option>
                    <option value="Landing Page">Landing Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Price (Rp IDR)</label>
                  <input
                    type="number"
                    required
                    value={newTemplate.price}
                    onChange={(e) => setNewTemplate({ ...newTemplate, price: e.target.value })}
                    placeholder="49000"
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Initial Status</label>
                  <select
                    value={newTemplate.status}
                    onChange={(e) => setNewTemplate({ ...newTemplate, status: e.target.value })}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Version</label>
                  <input
                    type="text"
                    value={newTemplate.version}
                    onChange={(e) => setNewTemplate({ ...newTemplate, version: e.target.value })}
                    placeholder="v1.0.0"
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              {/* Thumbnail Image Selection Source */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Thumbnail Cover Image</label>
                  <div className="flex bg-surface-container-low p-0.5 rounded-lg border border-outline-variant/30">
                    <button
                      type="button"
                      onClick={() => setThumbnailSourceType('file')}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                        thumbnailSourceType === 'file' ? 'bg-[#001A3D] text-white shadow-sm' : 'text-outline hover:text-primary'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setThumbnailSourceType('url')}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                        thumbnailSourceType === 'url' ? 'bg-[#001A3D] text-white shadow-sm' : 'text-outline hover:text-primary'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {thumbnailSourceType === 'file' ? (
                  <div className="border-2 border-dashed border-outline-variant/50 rounded-xl p-4 bg-surface-bright flex flex-col items-center justify-center gap-1.5 hover:border-secondary transition-all">
                    <span className="material-symbols-outlined text-outline text-[24px]">image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnailFile(e.target.files[0])}
                      className="text-[10px] font-semibold text-outline file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-[#001A3D]/10 file:text-[#001A3D] file:cursor-pointer hover:file:bg-[#001A3D]/15"
                    />
                    {thumbnailFile && (
                      <span className="text-[10px] font-bold text-[#0453cd] mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        {thumbnailFile.name}
                      </span>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={newTemplate.image}
                    onChange={(e) => setNewTemplate({ ...newTemplate, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary"
                  />
                )}
              </div>

              {/* Website Source / ZIP Upload & Live Demo url */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Website Code Package</label>
                  <div className="flex bg-surface-container-low p-0.5 rounded-lg border border-outline-variant/30">
                    <button
                      type="button"
                      onClick={() => setDemoSourceType('file')}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                        demoSourceType === 'file' ? 'bg-[#001A3D] text-white shadow-sm' : 'text-outline hover:text-primary'
                      }`}
                    >
                      Upload ZIP Package
                    </button>
                    <button
                      type="button"
                      onClick={() => setDemoSourceType('url')}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                        demoSourceType === 'url' ? 'bg-[#001A3D] text-white shadow-sm' : 'text-outline hover:text-primary'
                      }`}
                    >
                      Demo URL
                    </button>
                  </div>
                </div>

                {demoSourceType === 'file' ? (
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-outline-variant/50 rounded-xl p-4 bg-surface-bright flex flex-col items-center justify-center gap-1.5 hover:border-secondary transition-all">
                      <span className="material-symbols-outlined text-outline text-[24px]">folder_zip</span>
                      <input
                        type="file"
                        accept=".zip"
                        onChange={(e) => setZipFile(e.target.files[0])}
                        className="text-[10px] font-semibold text-outline file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:bg-[#001A3D]/10 file:text-[#001A3D] file:cursor-pointer hover:file:bg-[#001A3D]/15"
                      />
                      {zipFile && (
                        <span className="text-[10px] font-bold text-[#0453cd] mt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          {zipFile.name}
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Custom Folder Name / Slug</label>
                      <input
                        type="text"
                        value={customFolderName}
                        onChange={(e) => setCustomFolderName(e.target.value)}
                        placeholder={newTemplate.name ? slugify(newTemplate.name) : "e.g. my-awesome-store"}
                        className="w-full px-3 py-1.5 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary"
                      />
                      <span className="text-[9px] text-outline font-semibold mt-1 block">This becomes the URL directory, e.g.: /demos/{customFolderName || (newTemplate.name ? slugify(newTemplate.name) : "my-awesome-store")}/index.html</span>
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={newTemplate.demoUrl}
                    onChange={(e) => setNewTemplate({ ...newTemplate, demoUrl: e.target.value })}
                    placeholder="http://localhost:5174/demos/my-template/index.html"
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Description (dataAlt)</label>
                <textarea
                  rows="3"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="A short descriptive text detailing layouts, target users, and key features..."
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={uploadingFiles}
                className="w-full py-2.5 bg-[#001A3D] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity mt-4 shadow-sm flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {uploadingFiles ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                    Uploading & Deploying Files...
                  </>
                ) : (
                  'Add Template to Catalog'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT TEMPLATE MODAL --- */}
      {showEditModal && editingTemplate && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-150 overflow-y-auto max-h-[90vh]">
            
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-outline-variant/20">
              <h3 className="text-base font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">edit</span>
                Edit Template Information
              </h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-surface-container rounded-full text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEditTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Template Name</label>
                <input
                  type="text"
                  required
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={editingTemplate.category}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value })}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary"
                  >
                    <option value="Restaurant">Restaurant</option>
                    <option value="Salon">Salon</option>
                    <option value="Online Store">Online Store</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Dashboard">Dashboard</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Portfolio">Portfolio</option>
                    <option value="Landing Page">Landing Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Price (Rp IDR)</label>
                  <input
                    type="number"
                    required
                    value={editingTemplate.price}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, price: e.target.value })}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={editingTemplate.status}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, status: e.target.value })}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Version</label>
                  <input
                    type="text"
                    value={editingTemplate.version || ''}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, version: e.target.value })}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={editingTemplate.image || ''}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, image: e.target.value })}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Live Demo Preview URL</label>
                <input
                  type="text"
                  value={editingTemplate.demoUrl || ''}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, demoUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Description (dataAlt)</label>
                <textarea
                  rows="3"
                  value={editingTemplate.description || ''}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#001A3D] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity mt-4 shadow-sm"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Templates;
