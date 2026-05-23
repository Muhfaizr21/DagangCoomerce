import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import api from './api';

function Customers() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('all'); // all | Enterprise | Individual | Trial
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState(null);

  // --- Customers Database State ---
  const [customers, setCustomers] = useState([]);

  // --- Recent Activity Log State ---
  const [activities, setActivities] = useState([]);

  const [currentCustomer, setCurrentCustomer] = useState({
    id: null,
    name: '',
    email: '',
    status: 'Active',
    templates: 0,
    spend: 0,
    segment: 'Individual',
    avatar: '',
  });

  // Fetch Customers and Activities on Mount
  const fetchDashboardData = async () => {
    try {
      const [custRes, actRes] = await Promise.all([
        api.get('/customers'),
        api.get('/customers/activities')
      ]);
      setCustomers(custRes.data);
      setActivities(actRes.data);
    } catch (err) {
      console.error("Failed to load customer dashboard data", err);
      triggerToast("Error: Gagal memuat data dari database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // --- DRM Access Control ---
  const toggleDrmAccess = async (id) => {
    try {
      const res = await api.post(`/customers/${id}/toggle-drm`);
      const updatedCustomer = res.data;
      
      // Update local state
      setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
      
      // Re-fetch activities to reflect the DRM log update
      const actRes = await api.get('/customers/activities');
      setActivities(actRes.data);
      
      triggerToast(`DRM Access for ${updatedCustomer.name} is now ${updatedCustomer.status}!`);
    } catch (err) {
      console.error(err);
      triggerToast("Gagal memperbarui status DRM.");
    }
  };

  // --- Add / Edit Customer Actions ---
  const handleOpenAddModal = () => {
    setEditMode(false);
    setCurrentCustomer({
      id: null,
      name: '',
      email: '',
      status: 'Active',
      templates: 0,
      spend: 0,
      segment: 'Individual',
      avatar: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cust) => {
    setEditMode(true);
    setCurrentCustomer({ ...cust });
    setIsModalOpen(true);
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    if (!currentCustomer.name.trim() || !currentCustomer.email.trim()) return;

    try {
      setLoading(true);
      if (editMode) {
        const res = await api.put(`/customers/${currentCustomer.id}`, currentCustomer);
        const updated = res.data;
        setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
        triggerToast(`Customer data for ${updated.name} updated successfully!`);
      } else {
        const initialLetters = currentCustomer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        const payload = {
          ...currentCustomer,
          avatar: initialLetters || 'CU'
        };
        const res = await api.post('/customers', payload);
        const newCust = res.data;
        setCustomers(prev => [newCust, ...prev]);
        
        // Re-fetch activities to show registration log
        const actRes = await api.get('/customers/activities');
        setActivities(actRes.data);

        triggerToast(`New customer ${newCust.name} created!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || "Gagal menyimpan data pelanggan.";
      triggerToast(`Error: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name} from database?`)) {
      try {
        setLoading(true);
        await api.delete(`/customers/${id}`);
        setCustomers(prev => prev.filter(c => c.id !== id));
        
        // Re-fetch activities to show deletion log
        const actRes = await api.get('/customers/activities');
        setActivities(actRes.data);
        
        triggerToast(`Deleted customer ${name} from registry.`);
      } catch (err) {
        console.error(err);
        triggerToast("Gagal menghapus pelanggan.");
      } finally {
        setLoading(false);
      }
    }
  };

  // --- Export CSV Simulation ---
  const exportToCSV = () => {
    // Construct CSV content
    const headers = 'ID,Name,Email,Status,Templates,Spend,Segment\n';
    const rows = customers.map(c => `${c.id},"${c.name}",${c.email},${c.status},${c.templates},${c.spend},${c.segment}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DagangMaker_Customer_Registry_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('Customer registry exported to CSV successfully!');
  };

  // --- Filter and Search Logic ---
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSegment = selectedSegment === 'all' || c.segment === selectedSegment;
    return matchesSearch && matchesSegment;
  });

  // --- Pagination Logic ---
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Sync current page bounds if filter makes page empty
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [selectedSegment, searchQuery, totalPages, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
        <span className="text-secondary text-sm font-semibold">Memuat Database Pelanggan...</span>
      </div>
    );
  }

  // Count metrics for segments
  const countAll = customers.length;
  const countEnterprise = customers.filter(c => c.segment === 'Enterprise').length;
  const countIndividual = customers.filter(c => c.segment === 'Individual').length;
  const countTrial = customers.filter(c => c.segment === 'Trial').length;

  return (
    <div className="bg-background text-on-surface antialiased overflow-hidden flex h-screen">
      <Sidebar onLogout={() => console.log('Logout')} />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Search binds straight to searchQuery */}
        <TopNav title="Database Pelanggan" />

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto mt-16 p-6 md:p-10 bg-background">
          
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-[9999] bg-[#001A3D] text-white px-5 py-3.5 rounded-xl border border-white/10 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
              <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
              <span className="text-sm font-semibold">{toastMessage}</span>
            </div>
          )}

          <div className="max-w-[1440px] mx-auto space-y-6 pb-12">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">Database Pelanggan</h2>
                <p className="text-base text-on-surface-variant mt-1">Kelola data lisensi pembeli, status DRM templates, dan pelacakan transaksi.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm text-primary flex items-center gap-2 hover:bg-surface-container transition-colors shadow-sm font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export CSV
                </button>
                <button 
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 bg-[#001A3D] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add Customer
                </button>
              </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-12 gap-6">
              
              {/* Left Sidebar Columns (Grid: 3 cols) */}
              <aside className="col-span-12 lg:col-span-3 space-y-6">
                
                {/* 1. Segments filter */}
                <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-primary mb-4">Segments</h3>
                  <ul className="space-y-1.5">
                    <li>
                      <button
                        onClick={() => setSelectedSegment('all')}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                          selectedSegment === 'all' 
                            ? 'bg-surface-container-low text-primary border border-outline-variant/50' 
                            : 'text-on-surface-variant hover:bg-surface hover:text-primary'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0453cd]"></span>
                          All Customers
                        </div>
                        <span className="font-mono text-xs">{countAll}</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setSelectedSegment('Enterprise')}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                          selectedSegment === 'Enterprise' 
                            ? 'bg-surface-container-low text-primary border border-outline-variant/50' 
                            : 'text-on-surface-variant hover:bg-surface hover:text-primary'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-[18px]">domain</span>
                          Enterprise
                        </div>
                        <span className="font-mono text-xs">{countEnterprise}</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setSelectedSegment('Individual')}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                          selectedSegment === 'Individual' 
                            ? 'bg-surface-container-low text-primary border border-outline-variant/50' 
                            : 'text-on-surface-variant hover:bg-surface hover:text-primary'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-[18px]">person</span>
                          Individual
                        </div>
                        <span className="font-mono text-xs">{countIndividual}</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => setSelectedSegment('Trial')}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                          selectedSegment === 'Trial' 
                            ? 'bg-surface-container-low text-primary border border-outline-variant/50' 
                            : 'text-on-surface-variant hover:bg-surface hover:text-primary'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="material-symbols-outlined text-[18px]">schedule</span>
                          Trial Only
                        </div>
                        <span className="font-mono text-xs">{countTrial}</span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* 2. Recent Activities Log */}
                <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-primary mb-4">Recent Activity</h3>
                  <div className="relative border-l-2 border-surface-variant/70 ml-3 space-y-6 pb-2">
                    {activities.map((act) => (
                      <div key={act.id} className="relative pl-5">
                        <span className={`absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-surface-container-lowest ${
                          act.type === 'revoke' 
                            ? 'bg-error' 
                            : act.type === 'purchase'
                            ? 'bg-secondary'
                            : 'bg-surface-variant border border-outline-variant/60'
                        }`}></span>
                        <p className="text-xs text-on-surface leading-normal">
                          <strong className="text-primary font-bold">{act.name}</strong> {act.action}
                        </p>
                        <span className="text-[10px] text-outline font-semibold block mt-1">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main Database Table Columns (Grid: 9 cols) */}
              <section className="col-span-12 lg:col-span-9">
                <div className="bg-surface-container-lowest border border-surface-variant rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  
                  {/* Table Control Header */}
                  <div className="p-4 border-b border-surface-variant flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-surface-container-low">
                    
                    {/* Inline Search Bar */}
                    <div className="relative flex-1 max-w-sm">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">search</span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search name or email..."
                        className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-outline-variant/60 bg-surface-container-lowest focus:outline-none focus:border-[#001A3D] text-xs transition-all"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary text-[16px] material-symbols-outlined"
                        >
                          close
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-4 text-xs font-semibold text-on-surface-variant">
                      <span>Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} of {totalItems}</span>
                    </div>
                  </div>

                  {/* Customer Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low/50 text-xs text-on-surface-variant font-semibold border-b border-surface-variant uppercase tracking-wider">
                          <th className="py-4 px-6">Customer</th>
                          <th className="py-4 px-6">Status</th>
                          <th className="py-4 px-6">Templates</th>
                          <th className="py-4 px-6">Total Spend</th>
                          <th className="py-4 px-6 text-right">Access Controls</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-on-surface divide-y divide-surface-variant/40">
                        {currentItems.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-12 text-center text-on-surface-variant">
                              Tidak ada pelanggan yang cocok dengan pencarian / segmentasi.
                            </td>
                          </tr>
                        ) : (
                          currentItems.map((cust) => (
                            <tr key={cust.id} className="hover:bg-surface/50 transition-colors group">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant flex-shrink-0 flex items-center justify-center font-bold text-[#001A3D] text-xs">
                                    {cust.avatar.startsWith('http') ? (
                                      <img alt={cust.name} className="w-full h-full object-cover" src={cust.avatar} />
                                    ) : (
                                      cust.avatar
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-bold text-primary leading-tight">{cust.name}</div>
                                    <div className="text-xs text-on-surface-variant mt-0.5">{cust.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                  cust.status === 'Active' 
                                    ? 'bg-secondary-fixed text-on-secondary-fixed' 
                                    : cust.status === 'Trial'
                                    ? 'bg-surface-container-high text-on-surface-variant border border-outline-variant/30'
                                    : 'bg-error-container text-on-error-container'
                                }`}>
                                  {cust.status}
                                </span>
                              </td>
                              <td className="py-4 px-6 font-mono text-xs text-on-surface-variant">{cust.templates}</td>
                              <td className="py-4 px-6 font-bold text-primary">
                                {cust.spend === 0 ? 'Rp 0' : `Rp ${cust.spend.toLocaleString('id-ID')}`}
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => handleOpenEditModal(cust)}
                                    className="p-1.5 text-outline hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
                                    title="Edit Profile"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                  </button>
                                  <button 
                                    onClick={() => toggleDrmAccess(cust.id)}
                                    className={`p-1.5 rounded-lg transition-colors ${
                                      cust.status === 'Revoked' 
                                        ? 'text-error hover:bg-error-container' 
                                        : 'text-secondary-container hover:bg-surface-container'
                                    }`}
                                    title={cust.status === 'Revoked' ? 'Restore DRM' : 'Revoke DRM'}
                                  >
                                    <span className="material-symbols-outlined text-[18px]">
                                      {cust.status === 'Revoked' ? 'gpp_bad' : 'shield'}
                                    </span>
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                                    className="p-1.5 text-error/70 hover:text-error hover:bg-error-container rounded-lg transition-colors"
                                    title="Delete Customer"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="p-4 border-t border-surface-variant flex justify-between items-center bg-surface-container-lowest text-xs font-semibold">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Previous
                    </button>
                    
                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handlePageChange(index + 1)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                            currentPage === index + 1
                              ? 'bg-[#001A3D] text-white shadow-sm'
                              : 'text-on-surface-variant hover:bg-surface-container-low'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Next
                    </button>
                  </div>

                </div>
              </section>

            </div>
          </div>
        </main>
      </div>

      {/* --- ADD / EDIT CUSTOMER MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#000000]/50 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl border border-surface-variant max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-surface-variant bg-surface-container-low flex justify-between items-center">
              <h3 className="text-lg font-bold text-primary">
                {editMode ? 'Edit Customer Info' : 'Add New Customer'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-primary hover:bg-surface-container p-1 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSaveCustomer}>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={currentCustomer.name}
                    onChange={(e) => setCurrentCustomer(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-[#001A3D] text-sm bg-surface-container-lowest"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={currentCustomer.email}
                    onChange={(e) => setCurrentCustomer(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-[#001A3D] text-sm bg-surface-container-lowest"
                    placeholder="budi.s@example.com"
                  />
                </div>

                {/* Segment & Status Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Segment</label>
                    <select
                      value={currentCustomer.segment}
                      onChange={(e) => setCurrentCustomer(prev => ({ ...prev, segment: e.target.value }))}
                      className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-[#001A3D] text-sm bg-surface-container-lowest"
                    >
                      <option value="Enterprise">Enterprise</option>
                      <option value="Individual">Individual</option>
                      <option value="Trial">Trial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Access Status</label>
                    <select
                      value={currentCustomer.status}
                      onChange={(e) => setCurrentCustomer(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-[#001A3D] text-sm bg-surface-container-lowest"
                    >
                      <option value="Active">Active</option>
                      <option value="Trial">Trial</option>
                      <option value="Revoked">Revoked</option>
                    </select>
                  </div>
                </div>

                {/* Spend & Templates Sold Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Templates Owned</label>
                    <input
                      type="number"
                      min="0"
                      value={currentCustomer.templates}
                      onChange={(e) => setCurrentCustomer(prev => ({ ...prev, templates: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-[#001A3D] text-sm bg-surface-container-lowest"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Total Spend (Rupiah)</label>
                    <input
                      type="number"
                      min="0"
                      value={currentCustomer.spend}
                      onChange={(e) => setCurrentCustomer(prev => ({ ...prev, spend: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-[#001A3D] text-sm bg-surface-container-lowest"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-surface-variant bg-surface-container-low flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container text-sm font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#001A3D] text-white hover:opacity-90 text-sm font-semibold rounded-lg transition-all shadow-sm"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
