import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener('toggle-admin-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-admin-sidebar', handleToggle);
  }, []);

  // Close mobile sidebar when route path changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('admin_token');
      navigate('/admin/login');
    }
  };

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: 'extension', label: 'Templates', path: '/admin/templates' },
    { icon: 'shopping_cart', label: 'Orders', path: '/admin/orders' },
    { icon: 'group', label: 'Customers', path: '/admin/customers' },
    { icon: 'support_agent', label: 'Helpdesk', path: '/admin/helpdesk' },
    { icon: 'campaign', label: 'Promotions', path: '/admin/promotions' },
    { icon: 'web', label: 'CMS', path: '/admin/cms' },
    { icon: 'settings', label: 'Settings', path: '/admin/settings' },
  ];

  const renderContent = (isMobile = false) => (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center font-headline-md font-bold">
            D
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">DagangMaker</h1>
            <p className="text-xs text-white/60 uppercase tracking-wider font-semibold mt-0.5">Super Admin</p>
          </div>
        </div>

        {isMobile && (
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/5 border-none bg-transparent cursor-pointer flex items-center justify-center"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                  ? 'bg-white/10 text-white font-semibold scale-95'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'fill' : ''}`}>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* CTA & Footer */}
      <div className="mt-auto pt-6 border-t border-white/10 space-y-2">
        <button className="w-full py-2.5 px-4 bg-white text-[#001A3D] rounded-lg text-sm font-semibold hover:bg-white/90 transition-opacity flex items-center justify-center gap-2 shadow-sm border-none cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">support</span>
          Support System
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-error px-4 py-3 hover:bg-error/10 transition-colors rounded-xl mt-2 text-left border-none bg-transparent cursor-pointer"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col h-full py-10 px-6 w-[260px] bg-[#001A3D] border-r border-[#001A3D] shadow-sm z-50 flex-shrink-0">
        {renderContent(false)}
      </nav>

      {/* Mobile/Tablet Sidebar Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 md:hidden flex"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-[260px] h-full bg-[#001A3D] flex flex-col py-10 px-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
