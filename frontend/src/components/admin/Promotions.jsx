import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

function Promotions() {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Stateful database of coupons
  const [coupons, setCoupons] = useState([
    {
      id: '1',
      code: 'MERDEKA24',
      campaignName: 'Independence Day Sale',
      type: 'Percentage',
      value: 17,
      maxDiscount: 50000,
      minSpend: 0,
      redemptions: 8420,
      limit: 10000,
      status: 'Active',
      expiry: '2026-08-31',
      desc: 'Celebrate freedom with our custom cloud builder promotion.'
    },
    {
      id: '2',
      code: 'NEWUSER50',
      campaignName: 'Acquisition Campaign',
      type: 'Fixed Amount',
      value: 50000,
      maxDiscount: 50000,
      minSpend: 150000,
      redemptions: 2104,
      limit: null, // Unlimited
      status: 'Active',
      expiry: null, // No expiry
      desc: 'Exclusive welcome offer for newly registered merchant accounts.'
    },
    {
      id: '3',
      code: 'FREESHIP24',
      campaignName: 'Weekend Flash Sale',
      type: 'Free Shipping',
      value: 20000, // Max shipping subsidy
      maxDiscount: 20000,
      minSpend: 50000,
      redemptions: 4950,
      limit: 50000,
      status: 'Closing Soon',
      expiry: '2026-05-20',
      desc: 'Supercharge checkout conversion with free shipping across all templates.'
    },
    {
      id: '4',
      code: 'WINTERCLEAR',
      campaignName: 'Seasonal Clearance',
      type: 'Percentage',
      value: 40,
      maxDiscount: 100000,
      minSpend: 200000,
      redemptions: 2000,
      limit: 2000,
      status: 'Depleted',
      expiry: '2026-01-31',
      desc: 'Archived winter campaign for enterprise storefront licenses.'
    }
  ]);

  // Form inputs state
  const [formData, setFormData] = useState({
    code: 'SUMMER24',
    campaignName: 'Summer Launch Promotion',
    type: 'Percentage',
    value: 20,
    maxDiscount: 50000,
    minSpend: 100000,
    expiry: '2026-06-30',
    limit: 1000
  });

  const [toastMessage, setToastMessage] = useState(null);
  const [selectedCouponDetails, setSelectedCouponDetails] = useState(null);

  useEffect(() => {
    // Loaded instantly
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Generate a premium random promo code
  const handleAutoGenerateCode = () => {
    const prefixes = ['FLASH', 'MEGA', 'SAVE', 'VIP', 'OFFER', 'LAUNCH', 'CRAZY'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = Math.floor(10 + Math.random() * 90);
    const year = '26';
    const generated = `${prefix}${num}${year}`;
    
    setFormData(prev => ({
      ...prev,
      code: generated
    }));
    triggerToast(`Auto-generated promo code: ${generated}`);
  };

  // Submit and create new coupon
  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.campaignName.trim() || !formData.value) {
      triggerToast('Please complete all required fields.');
      return;
    }

    const newCoupon = {
      id: `${Date.now()}`,
      code: formData.code.toUpperCase().replace(/\s+/g, ''),
      campaignName: formData.campaignName,
      type: formData.type,
      value: parseFloat(formData.value),
      maxDiscount: parseFloat(formData.maxDiscount || 0),
      minSpend: parseFloat(formData.minSpend || 0),
      redemptions: 0,
      limit: formData.limit ? parseInt(formData.limit) : null,
      status: 'Active',
      expiry: formData.expiry || null,
      desc: 'Deployed via custom Coupon Generator hub.'
    };

    setCoupons([newCoupon, ...coupons]);
    triggerToast(`Coupon ${newCoupon.code} created & deployed successfully!`);
    
    // Reset form with new template code
    setFormData({
      code: 'PROMO' + Math.floor(1000 + Math.random() * 9000),
      campaignName: 'New Campaign Promo',
      type: 'Percentage',
      value: 15,
      maxDiscount: 25000,
      minSpend: 50000,
      expiry: '2026-12-31',
      limit: 500
    });
  };

  // Deactivate or Delete coupon state
  const handleToggleStatus = (id) => {
    setCoupons(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'Active' ? 'Depleted' : 'Active';
        triggerToast(`Coupon ${c.code} status set to ${nextStatus}`);
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const handleDeleteCoupon = (id, code) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    setSelectedCouponDetails(null);
    triggerToast(`Coupon ${code} permanently deleted.`);
  };

  // Derived calculations for executive KPIs
  const activeCoupons = coupons.filter(c => c.status === 'Active' || c.status === 'Closing Soon');
  const totalRedemptions = coupons.reduce((sum, c) => sum + c.redemptions, 0);
  const totalSavedValue = coupons.reduce((sum, c) => {
    // Estimate total discount given to merchants
    if (c.type === 'Percentage') {
      return sum + (c.redemptions * 15000); // assumption: average discount value of 15k
    } else {
      return sum + (c.redemptions * c.value);
    }
  }, 44800000); // baseline base static Rp 44.8M

  // Filtered lists matching query
  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
        <span className="text-secondary text-sm font-semibold">Memuat Manajemen Promosi...</span>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-surface antialiased overflow-hidden flex h-screen w-full">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
        <TopNav title="Manajemen Promosi" />

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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary">Manajemen Promosi</h2>
                <p className="text-sm text-on-surface-variant mt-1.5">Create, track, and analyze marketing campaigns.</p>
              </div>
              <button 
                onClick={() => triggerToast("Generating custom campaigns report...")}
                className="px-4 py-2 border border-outline-variant text-primary rounded-lg text-xs font-semibold hover:bg-surface-container transition-colors shadow-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                Export Report
              </button>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Saved by Users</span>
                  <div className="w-9 h-9 rounded-lg bg-surface-container-low text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary">Rp {(totalSavedValue / 1000000).toFixed(1)}M</h3>
                  <div className="flex items-center gap-1 mt-2 text-[#059669] font-semibold text-[11px]">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    <span>+12.5% from last month</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Redemptions</span>
                  <div className="w-9 h-9 rounded-lg bg-surface-container-low text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">loyalty</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary">{totalRedemptions.toLocaleString()}</h3>
                  <div className="flex items-center gap-1 mt-2 text-[#059669] font-semibold text-[11px]">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    <span>+8.2% from last month</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-sm flex flex-col justify-between relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-secondary/5 rounded-full blur-2xl"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Active Promo Codes</span>
                  <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">qr_code</span>
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-primary">{activeCoupons.length}</h3>
                  <div className="flex items-center gap-1 mt-2 text-on-surface-variant text-[11px] font-semibold">
                    <span>Across {activeCoupons.length} live marketing initiatives</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bento Layout Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Coupon Generator */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-outline-variant/30 bg-surface-container-low/40">
                    <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[20px]">magic_button</span>
                      Coupon Generator
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1.5">Instantly create and deploy new promotional codes.</p>
                  </div>
                  
                  <div className="p-5">
                    <form onSubmit={handleCreateCoupon} className="space-y-4">
                      
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Promo Code</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                            className="w-full pl-3 pr-10 py-2 border border-outline-variant rounded-lg text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                          />
                          <button
                            type="button"
                            onClick={handleAutoGenerateCode}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-secondary rounded hover:bg-surface-container transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">autorenew</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Campaign Name</label>
                        <input
                          type="text"
                          required
                          value={formData.campaignName}
                          onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                          placeholder="Independence Day Promotion"
                          className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Discount Type</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'Percentage', value: 20 })}
                            className={`px-3 py-2 border rounded-lg text-xs font-bold transition-all text-center ${
                              formData.type === 'Percentage' 
                                ? 'border-secondary bg-secondary/5 text-secondary' 
                                : 'border-outline-variant hover:bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            Percentage (%)
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'Fixed Amount', value: 50000 })}
                            className={`px-3 py-2 border rounded-lg text-xs font-bold transition-all text-center ${
                              formData.type === 'Fixed Amount' 
                                ? 'border-secondary bg-secondary/5 text-secondary' 
                                : 'border-outline-variant hover:bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            Fixed Rp
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Value</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">
                              {formData.type === 'Percentage' ? '%' : 'Rp'}
                            </span>
                            <input
                              type="number"
                              required
                              value={formData.value}
                              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                              className="w-full pl-8 pr-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Redemption Limit</label>
                          <input
                            type="number"
                            value={formData.limit || ''}
                            onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                            placeholder="Unlimited"
                            className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Expiry Date</label>
                        <input
                          type="date"
                          value={formData.expiry}
                          onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                          className="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#001A3D] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-transform active:scale-[0.98] shadow-sm flex justify-center items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">bolt</span>
                        Generate &amp; Activate
                      </button>

                    </form>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 flex gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5">lightbulb</span>
                  <div>
                    <h4 className="text-xs font-bold text-primary mb-1">Campaign Tip</h4>
                    <p className="text-[11px] leading-relaxed text-on-surface-variant font-medium">
                      Flash sales with short expiry times (24-48 hours) typically see a 35% higher redemption rate than open-ended codes. Try generating a weekend flash discount!
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Active Coupon Lists */}
              <div className="lg:col-span-8">
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col h-[600px]">
                  
                  <div className="p-5 border-b border-outline-variant/30 bg-surface-container-low/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-sm text-primary">Active Coupon Lists</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">Monitor current campaign performance and redemption limits.</p>
                    </div>

                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[16px]">search</span>
                      <input
                        type="text"
                        placeholder="Search codes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1 bg-surface border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-secondary w-40 sm:w-48 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low/55 border-b border-outline-variant/30 sticky top-0 z-10">
                          <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Code &amp; Type</th>
                          <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Value</th>
                          <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Redemptions</th>
                          <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                          <th className="p-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {filteredCoupons.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center py-20 text-xs font-semibold text-on-surface-variant">
                              No promo codes matching search parameter.
                            </td>
                          </tr>
                        ) : (
                          filteredCoupons.map((c) => {
                            const percentUsed = c.limit ? Math.min((c.redemptions / c.limit) * 100, 100) : 25;
                            return (
                              <tr 
                                key={c.id}
                                onClick={() => setSelectedCouponDetails(c)}
                                className="hover:bg-surface-container-low/40 transition-colors cursor-pointer group"
                              >
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-secondary/15 text-secondary flex items-center justify-center">
                                      <span className="material-symbols-outlined text-[18px]">
                                        {c.type === 'Percentage' ? 'percent' : c.type === 'Fixed Amount' ? 'attach_money' : 'local_shipping'}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-primary group-hover:text-secondary transition-colors">{c.code}</p>
                                      <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">{c.campaignName}</p>
                                    </div>
                                  </div>
                                </td>
                                
                                <td className="p-4">
                                  <p className="text-xs font-bold text-primary">
                                    {c.type === 'Percentage' ? `${c.value}% OFF` : `Rp ${c.value.toLocaleString()}`}
                                  </p>
                                  <p className="text-[10px] text-outline font-semibold mt-0.5">Min spend: Rp {c.minSpend.toLocaleString()}</p>
                                </td>

                                <td className="p-4 min-w-[180px]">
                                  <div className="flex justify-between text-[10px] mb-1 font-semibold">
                                    <span className="text-primary font-bold">{c.redemptions.toLocaleString()}</span>
                                    <span className="text-outline">/ {c.limit ? c.limit.toLocaleString() : 'Unlimited'}</span>
                                  </div>
                                  <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
                                    <div 
                                      className={`h-1.5 rounded-full transition-all duration-300 ${
                                        c.status === 'Depleted' 
                                          ? 'bg-outline/50' 
                                          : c.status === 'Closing Soon' 
                                          ? 'bg-error' 
                                          : 'bg-secondary'
                                      }`} 
                                      style={{ width: `${percentUsed}%` }}
                                    ></div>
                                  </div>
                                </td>

                                <td className="p-4 text-center">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                    c.status === 'Active' 
                                      ? 'bg-secondary-container/15 text-[#0453cd]' 
                                      : c.status === 'Closing Soon'
                                      ? 'bg-error-container text-on-error-container'
                                      : 'bg-surface-variant text-on-surface-variant'
                                  }`}>
                                    <span className={`w-1 h-1 rounded-full ${
                                      c.status === 'Active' ? 'bg-[#0453cd]' : c.status === 'Closing Soon' ? 'bg-error' : 'bg-outline'
                                    }`}></span>
                                    {c.status}
                                  </span>
                                  {c.expiry && (
                                    <p className="text-[9px] text-outline font-semibold mt-1">Ends {new Date(c.expiry).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                  )}
                                </td>

                                <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => handleToggleStatus(c.id)}
                                      title="Toggle activation state"
                                      className="p-1 hover:bg-surface-container rounded text-on-surface-variant hover:text-secondary transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-[16px]">power_settings_new</span>
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCoupon(c.id, c.code)}
                                      title="Delete Coupon"
                                      className="p-1 hover:bg-error-container rounded text-outline hover:text-error transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-[16px]">delete</span>
                                    </button>
                                  </div>
                                </td>

                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* --- COUPON DETAILS OVERVIEW MODAL --- */}
      {selectedCouponDetails && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-150 relative">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-outline-variant/20">
              <div>
                <span className="text-[10px] text-outline font-bold uppercase tracking-wider">Campaign Overview</span>
                <h3 className="text-base font-bold text-primary mt-0.5">{selectedCouponDetails.code}</h3>
              </div>
              <button 
                onClick={() => setSelectedCouponDetails(null)}
                className="p-1 hover:bg-surface-container rounded-full text-outline hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Campaign Detail</p>
                <p className="text-xs font-bold text-primary">{selectedCouponDetails.campaignName}</p>
                <p className="text-[11px] text-on-surface-variant font-medium mt-1 leading-relaxed">{selectedCouponDetails.desc}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-surface p-4 rounded-xl border border-outline-variant/15">
                <div>
                  <p className="text-[9px] font-bold text-outline uppercase tracking-wider">Discount Value</p>
                  <p className="text-xs font-bold text-[#0453cd] mt-0.5">
                    {selectedCouponDetails.type === 'Percentage' ? `${selectedCouponDetails.value}% Off` : `Rp ${selectedCouponDetails.value.toLocaleString()}`}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-outline uppercase tracking-wider">Min Spend</p>
                  <p className="text-xs font-bold text-primary mt-0.5">Rp {selectedCouponDetails.minSpend.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">Redemption Analytics</p>
                <div className="p-3.5 rounded-lg border border-outline-variant/10 flex justify-between items-center text-xs">
                  <div>
                    <p className="text-[10px] text-outline font-semibold">Total Redeemed</p>
                    <p className="text-sm font-bold text-primary mt-0.5">{selectedCouponDetails.redemptions.toLocaleString()} times</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-outline font-semibold">Coupon Status</p>
                    <span className="text-[10px] font-bold text-[#0453cd] uppercase tracking-wide mt-1 block">{selectedCouponDetails.status}</span>
                  </div>
                </div>
              </div>

              {selectedCouponDetails.expiry && (
                <div className="flex gap-2 items-center bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
                  <span className="material-symbols-outlined text-on-surface-variant text-[16px]">schedule</span>
                  <span className="text-[10px] text-on-surface-variant font-semibold">
                    Expires on {new Date(selectedCouponDetails.expiry).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              )}

              <div className="flex gap-3.5 pt-4">
                <button
                  onClick={() => {
                    handleToggleStatus(selectedCouponDetails.id);
                    setSelectedCouponDetails(prev => ({ ...prev, status: prev.status === 'Active' ? 'Depleted' : 'Active' }));
                  }}
                  className="flex-1 py-2 bg-surface border border-outline-variant text-xs text-primary font-bold rounded-lg hover:bg-surface-container transition-colors"
                >
                  {selectedCouponDetails.status === 'Active' ? 'Deactivate Coupon' : 'Activate Coupon'}
                </button>
                <button
                  onClick={() => handleDeleteCoupon(selectedCouponDetails.id, selectedCouponDetails.code)}
                  className="flex-1 py-2 bg-error-container text-on-error-container font-bold text-xs rounded-lg hover:opacity-90 transition-opacity"
                >
                  Delete Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Promotions;
