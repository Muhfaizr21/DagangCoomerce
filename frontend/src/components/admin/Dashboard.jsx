import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import SalesChart from './SalesChart';
import api from './api';

const KPICard = ({ title, icon, iconBg, iconColor, value, trend, isPositive }) => (
  <div className="bg-surface-container-lowest rounded-xl p-4 md:p-6 border border-surface-variant shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{title}</h3>
      <div className={`p-2 rounded-lg ${iconBg} ${iconColor}`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
    </div>
    <div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-primary">{value}</span>
      </div>
      <div className={`flex items-center gap-1 mt-2 ${isPositive === null ? 'text-on-surface-variant' : isPositive ? 'text-secondary' : 'text-error'}`}>
        <span className="material-symbols-outlined text-[16px]">
          {isPositive === null ? 'trending_flat' : isPositive ? 'trending_up' : 'trending_down'}
        </span>
        <span className="text-xs font-semibold">{trend}</span>
      </div>
    </div>
  </div>
);

const ActivityLog = ({ title, desc, time, colorClass }) => (
  <div className="relative pl-6">
    <div className={`absolute w-3 h-3 rounded-full -left-[7px] top-1.5 ring-4 ring-surface-container-lowest ${colorClass}`}></div>
    <p className="text-sm text-primary font-medium">{title}</p>
    <div className="flex justify-between items-center mt-1">
      <p className="text-xs text-on-surface-variant">{desc}</p>
      <span className="text-xs text-outline">{time}</span>
    </div>
  </div>
);

const TopSellingItem = ({ img, title, category, price, sales }) => (
  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface transition-colors border border-transparent hover:border-surface-variant">
    <img alt={title} className="w-14 h-14 rounded-md object-cover border border-outline-variant" src={img} />
    <div className="flex-1">
      <h4 className="text-sm font-bold text-primary">{title}</h4>
      <p className="text-xs text-on-surface-variant">{category}</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-primary">{price}</p>
      <p className="text-xs text-on-surface-variant">{sales}</p>
    </div>
  </div>
);

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [activityRefreshing, setActivityRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total_users: 0,
    active_stores: 0,
    total_revenue: 0,
    pending_tickets: 0,
  });
  const navigate = useNavigate();

  const fetchStats = useCallback(async (silent = false) => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    if (!silent) setLoading(true);
    try {
      const response = await api.get('/dashboard');
      if (response.data && response.data.stats) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Gagal mengambil statistik dashboard:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchStats();
    // Auto-refresh KPI stats every 60 seconds
    const interval = setInterval(() => fetchStats(true), 60000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const handleRefreshActivity = async () => {
    setActivityRefreshing(true);
    await fetchStats(true);
    setTimeout(() => setActivityRefreshing(false), 800);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
        <span className="text-secondary text-sm font-semibold">Memuat Dashboard...</span>
      </div>
    );
  }

  // Format dynamic revenue to Rupiah (e.g. Rp 51.663.000)
  const formattedRevenue = stats.total_revenue 
    ? `Rp ${stats.total_revenue.toLocaleString('id-ID')}`
    : 'Rp 51.663.000';

  return (
    <div className="bg-background text-on-surface antialiased overflow-hidden flex h-screen">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        <TopNav title="Dashboard Overview" />

        <main className="flex-1 overflow-y-auto mt-16 p-6 md:p-10 bg-background">
          <div className="max-w-[1440px] mx-auto space-y-6 pb-12">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">Overview</h2>
                <p className="text-base text-on-surface-variant mt-1">Real-time performance and system metrics.</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm text-primary flex items-center gap-2 hover:bg-surface-container transition-colors shadow-sm font-semibold">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  Last 30 Days
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </button>
                <button className="px-4 py-2 bg-[#001A3D] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Export Report
                </button>
              </div>
            </div>

            {/* KPI Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard 
                title="Total Revenue" 
                icon="payments" 
                iconBg="bg-primary-fixed" 
                iconColor="text-on-primary-fixed"
                value={formattedRevenue}
                trend="+12.4% vs last month"
                isPositive={true}
              />
              <KPICard 
                title="Active Customers" 
                icon="group" 
                iconBg="bg-secondary-fixed" 
                iconColor="text-on-secondary-fixed-variant"
                value={stats.total_users.toLocaleString('en-US')}
                trend="+5.2% vs last month"
                isPositive={true}
              />
              <KPICard 
                title="Active Stores" 
                icon="storefront" 
                iconBg="bg-tertiary-fixed" 
                iconColor="text-on-tertiary-fixed-variant"
                value={stats.active_stores.toLocaleString('en-US')}
                trend="+18.1% vs last month"
                isPositive={true}
              />
              <KPICard 
                title="Pending Tickets" 
                icon="support_agent" 
                iconBg="bg-surface-variant" 
                iconColor="text-on-surface-variant"
                value={stats.pending_tickets}
                trend="Requires attention"
                isPositive={false}
              />
            </div>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Sales Performance Chart */}
              <div className="lg:col-span-2 bg-surface-container-lowest border border-surface-variant rounded-xl shadow-sm p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Sales Performance</h3>
                    <p className="text-xs text-on-surface-variant mt-1">Weekly revenue trends across all platforms.</p>
                  </div>
                  <button className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
                <div className="flex-1 min-h-[300px] relative w-full">
                  <SalesChart />
                </div>
              </div>

              {/* Sales by Category Donut */}
              <div className="bg-surface-container-lowest border border-surface-variant rounded-xl shadow-sm p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">Sales by Category</h3>
                    <p className="text-xs text-on-surface-variant mt-1">Template distribution.</p>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center">
                  <div className="relative w-48 h-48 rounded-full flex items-center justify-center mb-6" style={{ background: "conic-gradient(#001A3D 0% 45%, #0453cd 45% 75%, #b2c7f3 75% 90%, #e6e8ea 90% 100%)" }}>
                    <div className="w-32 h-32 bg-surface-container-lowest rounded-full flex flex-col items-center justify-center shadow-inner">
                      <span className="text-xl font-bold text-primary">1,239</span>
                      <span className="text-xs text-on-surface-variant mt-1">Total</span>
                    </div>
                  </div>
                  
                  <div className="w-full space-y-3">
                    {[
                      { color: 'bg-[#001A3D]', label: 'Business', val: '45%' },
                      { color: 'bg-[#0453cd]', label: 'Fashion', val: '30%' },
                      { color: 'bg-[#b2c7f3]', label: 'Kuliner', val: '15%' },
                      { color: 'bg-[#e6e8ea]', label: 'Others', val: '10%' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                          <span className="text-sm font-semibold text-on-surface">{item.label}</span>
                        </div>
                        <span className="text-sm font-bold text-primary">{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Top Selling Templates */}
              <div className="bg-surface-container-lowest border border-surface-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-surface-variant flex justify-between items-center bg-surface-container-low">
                  <h3 className="text-lg font-semibold text-primary">Top Selling Templates</h3>
                  <button className="text-xs font-semibold text-secondary hover:underline">View All</button>
                </div>
                <div className="p-5 space-y-4 flex-1">
                  <TopSellingItem 
                    img="https://lh3.googleusercontent.com/aida-public/AB6AXuCXngt0zQzAMnkT7ki5t7P5Iq7W5JsDWY2buWMlMS1aOpUqlABo_ukjB3hre7YMBd3JTu4UogrYIONxUvfipnbK0j2RBTa5pacfEca4Nbs9Mcg4UOsWYei3nfaaWEdz-sIjSFnGsOUoZLxrOABF1sBJhhK_mzlW-IDl-AhjZxgBKoR-pHCU6G0Zt0RMPT5SMjZUb1YO__HQY2wxs_gcuolc8Or7xjMZ2dDfPyKDEVFJicR_eG-5M0XX8PZopdHFYaM38GEUhWtPAo_3"
                    title="Corporate Pro"
                    category="Business Category"
                    price="Rp 452.000"
                    sales="320 sales"
                  />
                  <TopSellingItem 
                    img="https://lh3.googleusercontent.com/aida-public/AB6AXuBBEHhivPiwkUtEbV6rPjU5Pp5rrYsD0GGJzgdsSrWXVfDhKIP5OVkSuhClVpxH-6xJD2LitchDNu-d89vrhlgYoFgp5vVBxo-Bdyed9eXjBnxSV_ZQKoCMyOdUegd9sQ-71rSQbfjc1bbx2m4c2WlG0C2zjeDdjS1xSy81yJZ7338zQlIAtBJenDfg49BLqulJm1mHsJukx-y6xohNPaUpOoWp2NXuK5TH6jbOC2599dkDW64GiVEz6SXcp1mktrBBOHXgJ8wSbGUd"
                    title="Chic Boutique"
                    category="Fashion Category"
                    price="Rp 381.500"
                    sales="215 sales"
                  />
                  <TopSellingItem 
                    img="https://lh3.googleusercontent.com/aida-public/AB6AXuBYfLYOdw3D5-p8a1sPBE4KH3bmVGHN--3ls-o4QHMMdHGytEWlvv4G4kKIKhDUNeePtIhakM_EgMvnXuK4McohCNfB0XUehL8ah63D6Nqat3neA9nP6k4jvyA4ngk6v1hzBc8JLKCziosdKsJguIUNmAWv5KAyfY4PdKrrYooA5u7XAUN2nTjwmNlR7I055rae4Jrrya9PQsvBNY5oOOHFN3uiLPhUePT76x-TyXfwYzG2-C54u0yK3O35TEes_yYP3hI4a4K00TmA"
                    title="Bistro Delight"
                    category="Kuliner Category"
                    price="Rp 298.000"
                    sales="185 sales"
                  />
                </div>
              </div>

              {/* Recent System Activity */}
              <div className="bg-surface-container-lowest border border-surface-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-surface-variant flex justify-between items-center bg-surface-container-low">
                  <h3 className="text-lg font-semibold text-primary">Recent System Activity</h3>
                  <button 
                    onClick={handleRefreshActivity}
                    className="p-1 hover:bg-surface-container rounded transition-colors text-on-surface-variant"
                    title="Refresh Activity"
                  >
                    <span className={`material-symbols-outlined text-[20px] ${activityRefreshing ? 'animate-spin' : ''}`}>refresh</span>
                  </button>
                </div>
                <div className="p-5 flex-1">
                  <div className="relative border-l-2 border-surface-variant ml-4 space-y-6 pb-4">
                    <ActivityLog 
                      colorClass="bg-secondary" 
                      title="New customer registered" 
                      desc="ID: CUST-88392 (Retail)" 
                      time="Just now" 
                    />
                    <ActivityLog 
                      colorClass="bg-[#001A3D]" 
                      title="Payment verified for Order #ORD-9921" 
                      desc="Amount: Rp 1.250.000 via Transfer Bank" 
                      time="12 mins ago" 
                    />
                    <ActivityLog 
                      colorClass="bg-error" 
                      title="New helpdesk ticket created" 
                      desc="Issue: Template installation error" 
                      time="1 hr ago" 
                    />
                    <ActivityLog 
                      colorClass="bg-surface-variant" 
                      title="System backup completed" 
                      desc="Automated daily routine" 
                      time="3 hrs ago" 
                    />
                  </div>
                  <button className="w-full mt-4 py-2 border border-outline-variant rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface transition-colors">
                    Load More
                  </button>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
