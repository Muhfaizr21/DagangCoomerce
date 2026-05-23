import React from 'react';
import { Link } from 'react-router-dom';

const TopNav = ({ title = "Dashboard Overview" }) => {
  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-admin-sidebar'));
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-[260px] z-40 flex justify-between items-center px-4 md:px-8 h-16 bg-surface-container-lowest dark:bg-inverse-surface border-b border-outline-variant shadow-sm transition-all duration-300">
      {/* Left: Breadcrumbs & Hamburger */}
      <div className="flex items-center gap-2">
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all border-none bg-transparent cursor-pointer flex items-center justify-center"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <nav aria-label="Breadcrumb" className="flex">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/admin/dashboard" className="inline-flex items-center text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
                Admin Console
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-outline mx-1 text-base">chevron_right</span>
                <span className="text-sm font-bold text-primary border-b-2 border-secondary pb-1 ml-1 md:ml-2 mt-1">
                  {title}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      
      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2">
        <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all">
          <span className="material-symbols-outlined">search</span>
        </button>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-surface-container-lowest"></span>
        </button>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-all">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        <button className="p-1 text-on-surface-variant hover:bg-surface-container rounded-full transition-all ml-2">
          <img 
            alt="Admin Profile Avatar" 
            className="w-8 h-8 rounded-full border border-outline-variant object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYlkKlUW3Y1IxzCCOHMvEmDBRItW9LNbepLZeyms7DjEcndjls6jAUdm6Cv3fuZQZFJ-_tRjhNuhbeBFR-SzXkxRS1hexGBoOUxKJFDRTDmAkl7eMBPQMDWeqjSsjwSGcDztkXmTMPBiUsO7CKalEe54GS-8FU72mlzSmW1l-RLySCPBTdkm92-zUWg2lwbh4vO7FIqartdnG8c9WCKDqTZO2ChRyK3wHR1oYb_BcdXZu7HNJhO5eYAFApcRbDkT3S2d9CAegZhi26" 
          />
        </button>
      </div>
    </header>
  );
};

export default TopNav;
