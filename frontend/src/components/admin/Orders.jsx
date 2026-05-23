import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import api from './api';

// Helper to format timestamps to readable format like 'Just now', '10 mins ago', '1 hr ago', '2 days ago'
const formatTime = (dateStr) => {
  if (!dateStr) return 'Just now';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHrs < 24) return `${diffHrs} hr${diffHrs > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

function Orders() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');
  
  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  // --- Stateful Transactions Database ---
  const [orders, setOrders] = useState([]);

  // --- Stateful Projects Database ---
  const [projects, setProjects] = useState([]);

  // --- Form input states ---
  const [newOrderName, setNewOrderName] = useState('');
  const [newOrderEmail, setNewOrderEmail] = useState('');
  const [newOrderAmount, setNewOrderAmount] = useState('');
  const [newOrderStatus, setNewOrderStatus] = useState('Pending');
  const [newOrderTemplate, setNewOrderTemplate] = useState('Chic Boutique Pro');
  const [newOrderPayment, setNewOrderPayment] = useState('Transfer Virtual Account');

  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjClient, setNewProjClient] = useState('');
  const [newProjProgress, setNewProjProgress] = useState(15);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, projectsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/projects')
      ]);

      const formattedOrders = (ordersRes.data || []).map(o => ({
        ...o,
        id: o.order_id,
        realDbId: o.id,
        time: formatTime(o.created_at || o.CreatedAt),
        paymentMethod: o.paymentMethod || o.payment_method,
        timeline: (o.timeline || []).map(t => ({
          title: t.title,
          desc: t.desc,
          time: formatTime(t.created_at || t.CreatedAt),
          done: t.done
        }))
      }));

      const formattedProjects = (projectsRes.data || []).map(p => ({
        ...p,
        id: p.project_id,
        realDbId: p.id,
        stages: p.stages || ['Planning', 'Hardware', 'Software', 'Live']
      }));

      setOrders(formattedOrders);
      setProjects(formattedProjects);
    } catch (err) {
      console.error("Error fetching data:", err);
      triggerToast('Gagal memuat data dari server backend');
    } finally {
      setLoading(false);
    }
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // --- Calculations derived from state ---
  const paidOrders = orders.filter(o => o.status === 'Paid');
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  
  const totalVolume = paidOrders.reduce((sum, o) => sum + o.amount, 0) + 1284000000; // Static base + live state
  const pendingSettlement = pendingOrders.reduce((sum, o) => sum + o.amount, 0) + 137400000; // Base + live
  
  const totalAttempts = orders.length;
  const successfulAttempts = paidOrders.length;
  const successRate = totalAttempts > 0 ? ((successfulAttempts / totalAttempts) * 100).toFixed(1) : '100.0';

  // --- Add Order Callback ---
  const handleAddOrder = async (e) => {
    e.preventDefault();
    if (!newOrderName.trim() || !newOrderEmail.trim() || !newOrderAmount) {
      triggerToast('Please fill out all fields correctly.');
      return;
    }

    try {
      const response = await api.post('/orders', {
        customer: newOrderName,
        email: newOrderEmail,
        avatar: newOrderName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
        amount: parseFloat(newOrderAmount),
        status: newOrderStatus,
        template: newOrderTemplate,
        payment_method: newOrderPayment
      });

      const newOrder = response.data;
      const formattedNewOrder = {
        ...newOrder,
        id: newOrder.order_id,
        realDbId: newOrder.id,
        time: 'Just now',
        paymentMethod: newOrder.paymentMethod || newOrder.payment_method,
        timeline: (newOrder.timeline || []).map(t => ({
          title: t.title,
          desc: t.desc,
          time: 'Just now',
          done: t.done
        }))
      };

      setOrders([formattedNewOrder, ...orders]);
      setShowAddOrderModal(false);
      
      // Reset forms
      setNewOrderName('');
      setNewOrderEmail('');
      setNewOrderAmount('');
      setNewOrderStatus('Pending');
      
      triggerToast(`Order ${formattedNewOrder.id} created successfully!`);
    } catch (err) {
      console.error("Error creating order:", err);
      triggerToast('Gagal membuat pesanan baru.');
    }
  };

  // --- Status Update Callback ---
  const handleUpdateOrderStatus = async (orderId, targetStatus) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, {
        status: targetStatus
      });

      const updatedOrder = response.data;

      setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: updatedOrder.status,
            timeline: (updatedOrder.timeline || []).map(t => ({
              title: t.title,
              desc: t.desc,
              time: formatTime(t.created_at || t.CreatedAt),
              done: t.done
            }))
          };
        }
        return o;
      }));
      
      // Update selected order modal view in-place
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          status: updatedOrder.status,
          timeline: (updatedOrder.timeline || []).map(t => ({
            title: t.title,
            desc: t.desc,
            time: formatTime(t.created_at || t.CreatedAt),
            done: t.done
          }))
        }));
      }

      triggerToast(`Order #${orderId} marked as ${targetStatus}!`);
    } catch (err) {
      console.error("Error updating order status:", err);
      triggerToast('Gagal memperbarui status pesanan.');
    }
  };

  // --- Add Project Callback ---
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjClient.trim()) {
      triggerToast('Please specify project title and client name.');
      return;
    }

    try {
      const response = await api.post('/projects', {
        title: newProjTitle,
        client: newProjClient,
        progress: parseInt(newProjProgress)
      });

      const newProj = response.data;
      const formattedProj = {
        ...newProj,
        id: newProj.project_id,
        realDbId: newProj.id,
        stages: newProj.stages || ['Planning', 'Hardware', 'Software', 'Live']
      };

      setProjects([formattedProj, ...projects]);
      setShowAddProjectModal(false);
      setNewProjTitle('');
      setNewProjClient('');
      setNewProjProgress(15);
      triggerToast(`Project "${formattedProj.title}" setup initiated!`);
    } catch (err) {
      console.error("Error creating project:", err);
      triggerToast('Gagal membuat proyek baru.');
    }
  };

  // --- Update Project Progress Callback ---
  const handleSaveProjectProgress = async (newVal) => {
    // 1. Update local state immediately for visual responsiveness
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, progress: newVal } : p));
    setSelectedProject(prev => ({ ...prev, progress: newVal }));

    // 2. Persist to server
    try {
      await api.put(`/projects/${selectedProject.id}/progress`, {
        progress: newVal
      });
      triggerToast(`Updated "${selectedProject.title}" progress to ${newVal}%`);
    } catch (err) {
      console.error("Error updating project progress:", err);
      triggerToast('Gagal menyimpan perubahan progres ke server.');
    }
  };

  // --- Filter and Search Logic ---
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.template.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (selectedStatusTab === 'All') return matchesSearch;
    return matchesSearch && o.status === selectedStatusTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
        <span className="text-secondary text-sm font-semibold">Memuat Pesanan & Transaksi...</span>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface antialiased overflow-hidden flex h-screen w-full">
      <Sidebar onLogout={() => console.log('Logout')} />

      <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
        <TopNav title="Pesanan & Transaksi" />

        {/* Global Toast Message */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[9999] bg-[#001A3D] text-white px-5 py-3.5 rounded-xl border border-white/10 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
            <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto mt-16 p-6 md:p-10 bg-background">
          <div className="max-w-[1440px] mx-auto space-y-8 pb-12">
            
            {/* Header info panel */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary">Pesanan &amp; Transaksi</h2>
                <p className="text-sm text-on-surface-variant mt-1.5">Monitor financial health and track project progress.</p>
              </div>
              <div className="flex gap-2.5">
                <button 
                  onClick={() => setShowAddOrderModal(true)}
                  className="px-4 py-2 bg-[#001A3D] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                  Create Order
                </button>
                <button 
                  onClick={() => setShowAddProjectModal(true)}
                  className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-xs text-primary rounded-lg font-semibold hover:bg-surface-container transition-colors shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">engineering</span>
                  New Project
                </button>
              </div>
            </div>

            {/* Executive KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* KPI 1 */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 relative overflow-hidden group hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Transaction Volume (30d)</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-primary mt-2">Rp {totalVolume.toLocaleString('id-ID')}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-secondary-container/10 flex items-center justify-center text-[#0453cd]">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0453cd] text-sm">trending_up</span>
                  <span className="text-xs font-bold text-[#0453cd]">+12.5%</span>
                  <span className="text-xs text-on-surface-variant font-medium">vs last month</span>
                </div>
                
                {/* Decorative Sparkline Chart */}
                <div className="absolute bottom-0 left-0 right-0 h-12 opacity-10 pointer-events-none">
                  <svg className="w-full h-full stroke-[#0453cd] fill-none" preserveAspectRatio="none" strokeWidth="2" viewBox="0 0 100 30">
                    <path d="M0,25 C20,20 40,10 60,15 C80,20 90,5 100,10"></path>
                  </svg>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Pending Settlements</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-primary mt-2">Rp {pendingSettlement.toLocaleString('id-ID')}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined">pending_actions</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs text-on-surface-variant font-medium">Across {pendingOrders.length + 14} active pending settlements</span>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Success Rate</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-primary mt-2">{successRate}%</h3>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-secondary-container/10 flex items-center justify-center text-[#0453cd]">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-sm">trending_down</span>
                  <span className="text-xs font-bold text-error">-0.4%</span>
                  <span className="text-xs text-on-surface-variant font-medium">vs last month</span>
                </div>
              </div>

            </div>

            {/* Bento Grid: Live Feed & Tracking */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Transactions Feed Column */}
              <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex flex-col h-[580px] overflow-hidden">
                <div className="p-5 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low/40">
                  <div>
                    <h3 className="font-bold text-sm text-primary">Live Transactions</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">Real-time order processing feed.</p>
                  </div>

                  {/* Search and Tabs inside wrapper */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">search</span>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1 bg-surface border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-[#001A3D] w-36 transition-all"
                      />
                    </div>
                    
                    <select
                      value={selectedStatusTab}
                      onChange={(e) => setSelectedStatusTab(e.target.value)}
                      className="px-2 py-1 bg-surface border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none"
                    >
                      <option value="All">All States</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant/30 sticky top-0 z-10">
                        <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Order ID &amp; Customer</th>
                        <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Template Purchased</th>
                        <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Amount</th>
                        <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                        <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-20 text-xs font-semibold text-on-surface-variant">
                            No matching transactions recorded.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((o) => (
                          <tr 
                            key={o.id}
                            onClick={() => setSelectedOrder(o)}
                            className="hover:bg-surface-container-low/50 transition-colors cursor-pointer group"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#001A3D]/10 text-[#001A3D] flex items-center justify-center font-bold text-xs">
                                  {o.avatar}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-primary group-hover:text-[#0453cd] transition-colors">{o.id}</p>
                                  <p className="text-[11px] text-on-surface-variant font-medium mt-0.5">{o.customer}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <p className="text-xs font-semibold text-primary truncate max-w-[180px]">{o.template}</p>
                              <p className="text-[10px] text-outline font-medium mt-0.5">{o.paymentMethod}</p>
                            </td>
                            <td className="p-4 text-right">
                              <span className="text-xs font-bold text-primary">Rp {o.amount.toLocaleString('id-ID')}</span>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                o.status === 'Paid' 
                                  ? 'bg-secondary-container/15 text-[#0453cd]' 
                                  : o.status === 'Pending'
                                  ? 'bg-surface-variant text-on-surface-variant'
                                  : 'bg-error-container text-on-error-container'
                              }`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="p-4 text-xs text-on-surface-variant font-semibold">
                              {o.time}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Project Progress Tracking Sidebar */}
              <div className="bg-[#011b3e] text-white rounded-xl shadow-sm overflow-hidden h-[580px] flex flex-col relative border border-white/5">
                
                {/* Header */}
                <div className="p-5 border-b border-white/10 bg-[#011b3e]/90 backdrop-blur-sm flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-white">Project Tracking</h3>
                    <p className="text-xs text-white/60 mt-0.5">Done-for-you installations.</p>
                  </div>
                  <span className="material-symbols-outlined text-white/50 text-[20px]">construction</span>
                </div>

                {/* Grid Lists */}
                <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar">
                  {projects.map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        setSelectedProject(p);
                        setShowProjectModal(true);
                      }}
                      className="glass-panel p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-xs font-bold text-white group-hover:text-secondary-fixed-dim transition-colors">{p.title}</h4>
                        <span className="text-xs font-bold text-white/80">{p.progress}%</span>
                      </div>
                      
                      <p className="text-[10px] text-white/50 mb-3">Client: {p.client}</p>
                      
                      {/* Bar Fill */}
                      <div className="w-full bg-black/35 rounded-full h-1.5 mb-2 overflow-hidden">
                        <div className="bg-[#b2c5ff] h-1.5 rounded-full transition-all duration-500" style={{ width: `${p.progress}%` }}></div>
                      </div>

                      {/* Milestones Indicator */}
                      <div className="flex justify-between text-[9px] text-white/40">
                        <span className={p.progress >= 15 ? 'text-white font-bold' : ''}>Planning</span>
                        <span className={p.progress >= 40 ? 'text-white font-bold' : ''}>Hardware</span>
                        <span className={p.progress >= 70 ? 'text-white font-bold' : ''}>Software</span>
                        <span className={p.progress >= 100 ? 'text-white font-bold' : ''}>Live</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* --- ADD ORDER MODAL --- */}
      {showAddOrderModal && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">add_shopping_cart</span>
                Create New Order
              </h3>
              <button 
                onClick={() => setShowAddOrderModal(false)}
                className="p-1 hover:bg-surface-container rounded-full text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={newOrderName}
                  onChange={(e) => setNewOrderName(e.target.value)}
                  placeholder="e.g. Ahmad Syahmi"
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-[#001A3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Customer Email</label>
                <input
                  type="email"
                  required
                  value={newOrderEmail}
                  onChange={(e) => setNewOrderEmail(e.target.value)}
                  placeholder="e.g. customer@example.com"
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-[#001A3D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Amount (Rp)</label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={newOrderAmount}
                    onChange={(e) => setNewOrderAmount(e.target.value)}
                    placeholder="8500000"
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-[#001A3D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Initial Status</label>
                  <select
                    value={newOrderStatus}
                    onChange={(e) => setNewOrderStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-[#001A3D]"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Template Selection</label>
                <select
                  value={newOrderTemplate}
                  onChange={(e) => setNewOrderTemplate(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-[#001A3D]"
                >
                  <option value="Chic Boutique Pro">Chic Boutique Pro (Fashion)</option>
                  <option value="Bistro Delight Suite">Bistro Delight Suite (Culiner)</option>
                  <option value="Corporate Pro Enterprise">Corporate Pro Enterprise (Business)</option>
                  <option value="MegaMall Multi-Vendor Suite">MegaMall Multi-Vendor Suite</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Payment Method</label>
                <select
                  value={newOrderPayment}
                  onChange={(e) => setNewOrderPayment(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-[#001A3D]"
                >
                  <option value="FPX (Maybank2u)">FPX (Maybank2u)</option>
                  <option value="FPX (CIMB Clicks)">FPX (CIMB Clicks)</option>
                  <option value="Stripe Credit Card">Stripe Credit Card</option>
                  <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#001A3D] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity mt-4"
              >
                Initiate Transaction
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- TRANSACTION DETAILS & ACTIONS MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-150 relative overflow-hidden">
            
            <div className="flex justify-between items-center mb-6 border-b border-outline-variant/30 pb-4">
              <div>
                <span className="font-mono text-xs text-on-surface-variant">#{selectedOrder.id}</span>
                <h3 className="text-lg font-bold text-primary mt-1">Transaction Details</h3>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-1 hover:bg-surface-container rounded-full text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Client Info Grid */}
              <div className="grid grid-cols-2 gap-4 bg-surface p-4 rounded-xl border border-outline-variant/20">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Customer</p>
                  <p className="text-xs font-bold text-primary mt-1">{selectedOrder.customer}</p>
                  <p className="text-[11px] text-outline mt-0.5">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Billing Amount</p>
                  <p className="text-xs font-bold text-primary mt-1">Rp {selectedOrder.amount.toLocaleString('id-ID')}</p>
                  <p className="text-[11px] text-outline mt-0.5">Method: {selectedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Purchase Details */}
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Purchase Artifact</p>
                <div className="p-3 bg-surface rounded-lg border border-outline-variant/10 flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-[24px]">shopping_bag</span>
                  <div>
                    <p className="text-xs font-bold text-primary">{selectedOrder.template}</p>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-0.5">Includes full source files &amp; automated cloud deployment</p>
                  </div>
                </div>
              </div>

              {/* Timeline tracking */}
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">Order Processing Timeline</p>
                <div className="space-y-3 pl-3.5 border-l-2 border-outline-variant/20 relative">
                  {selectedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute w-3.5 h-3.5 rounded-full -left-[22px] top-0 flex items-center justify-center border-2 ${
                        step.done 
                          ? 'bg-[#0453cd] border-[#0453cd] text-white' 
                          : 'bg-surface-container border-outline-variant text-outline'
                      }`}>
                        {step.done && <span className="material-symbols-outlined text-[8px] font-bold">check</span>}
                      </div>
                      <h4 className="text-xs font-bold text-primary">{step.title}</h4>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{step.desc}</p>
                      <span className="text-[9px] text-outline font-semibold mt-0.5 block">{step.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3.5 border-t border-outline-variant/30 pt-5">
                {selectedOrder.status !== 'Paid' && (
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'Paid')}
                    className="flex-1 py-2 bg-secondary text-white rounded-lg text-xs font-bold hover:opacity-95 transition-opacity"
                  >
                    Mark as Paid
                  </button>
                )}
                {selectedOrder.status !== 'Failed' && (
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'Failed')}
                    className="flex-1 py-2 bg-error-container text-on-error-container border border-error-container rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                  >
                    Cancel / Refund
                  </button>
                )}
                {selectedOrder.status === 'Paid' && (
                  <button
                    onClick={() => triggerToast(`Cloud Deployment sync initiated for order #${selectedOrder.id}`)}
                    className="flex-1 py-2 bg-[#001A3D] text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">cloud_sync</span>
                    Sync Cloud DFY
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- ADD PROJECT MODAL --- */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">engineering</span>
                Add Done-For-You Project
              </h3>
              <button 
                onClick={() => setShowAddProjectModal(false)}
                className="p-1 hover:bg-surface-container rounded-full text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  placeholder="e.g. Gourmet Cafe Setup"
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-[#001A3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Client Business Name</label>
                <input
                  type="text"
                  required
                  value={newProjClient}
                  onChange={(e) => setNewProjClient(e.target.value)}
                  placeholder="e.g. Brews & Beans Enterprise"
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-[#001A3D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Initial Progress Stage</label>
                <select
                  value={newProjProgress}
                  onChange={(e) => setNewProjProgress(e.target.value)}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-[#001A3D]"
                >
                  <option value="15">Planning Stage (15%)</option>
                  <option value="40">Hardware Provisioning (40%)</option>
                  <option value="70">Software Customization (70%)</option>
                  <option value="100">Live &amp; Launch (100%)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#001A3D] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity mt-4"
              >
                Initiate Project Installation
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- PROJECT PROGRESS SLIDER MODAL --- */}
      {showProjectModal && selectedProject && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[10px] text-outline font-bold uppercase tracking-wider">Installation Registry</span>
                <h3 className="text-base font-bold text-primary mt-0.5">{selectedProject.title}</h3>
              </div>
              <button 
                onClick={() => setShowProjectModal(false)}
                className="p-1 hover:bg-surface-container rounded-full text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-surface p-4 rounded-xl border border-outline-variant/10">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Client Registry</p>
                <p className="text-xs font-bold text-primary mt-1">{selectedProject.client}</p>
                <p className="text-[10px] text-outline font-medium mt-0.5">Project ID: {selectedProject.id}</p>
              </div>

              {/* Slider Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Installation Progress</label>
                  <span className="text-sm font-bold text-[#0453cd]">{selectedProject.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={selectedProject.progress}
                  onChange={(e) => handleSaveProjectProgress(parseInt(e.target.value))}
                  className="w-full accent-[#0453cd] cursor-pointer bg-surface-container h-2 rounded-lg"
                />
              </div>

              {/* Stage milestones description */}
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Milestone Stages</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className={`p-2 rounded border text-[9px] font-bold ${selectedProject.progress >= 15 ? 'bg-secondary-container/10 border-[#0453cd] text-[#0453cd]' : 'bg-surface border-outline-variant/20 text-outline'}`}>
                    Planning<br/>(15%+)
                  </div>
                  <div className={`p-2 rounded border text-[9px] font-bold ${selectedProject.progress >= 40 ? 'bg-secondary-container/10 border-[#0453cd] text-[#0453cd]' : 'bg-surface border-outline-variant/20 text-outline'}`}>
                    Hardware<br/>(40%+)
                  </div>
                  <div className={`p-2 rounded border text-[9px] font-bold ${selectedProject.progress >= 70 ? 'bg-secondary-container/10 border-[#0453cd] text-[#0453cd]' : 'bg-surface border-outline-variant/20 text-outline'}`}>
                    Software<br/>(70%+)
                  </div>
                  <div className={`p-2 rounded border text-[9px] font-bold ${selectedProject.progress >= 100 ? 'bg-secondary-container/10 border-[#0453cd] text-[#0453cd]' : 'bg-surface border-outline-variant/20 text-outline'}`}>
                    Live Launch<br/>(100%)
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowProjectModal(false)}
                className="w-full py-2 bg-[#001A3D] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity mt-4"
              >
                Close and Save Registry
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Orders;
