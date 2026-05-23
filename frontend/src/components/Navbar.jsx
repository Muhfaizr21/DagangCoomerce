import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

function Navbar({ onLoginClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getNavLinkClass = ({ isActive }) => {
    return `font-label-md text-label-md transition-colors hover:text-primary ${isActive ? 'text-primary font-bold md:border-b-2 md:border-primary md:pb-1 text-primary' : 'text-on-surface-variant'
      }`;
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 max-w-container-max mx-auto w-full relative">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-headline-md font-headline-lg text-primary tracking-tight cursor-pointer border-none bg-transparent font-extrabold hover:opacity-90 active:scale-95 transition-all"
          >
            DagangMaker
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-label-md text-label-md ml-auto">
          <NavLink to="/" className={getNavLinkClass} end>
            Beranda
          </NavLink>
          <NavLink to="/blog" className={getNavLinkClass}>
            Blog
          </NavLink>
          <NavLink to="/templates" className={getNavLinkClass}>
            Template
          </NavLink>
          <NavLink to="/pricing" className={getNavLinkClass}>
            Harga
          </NavLink>
          <NavLink to="/tentang-kami" className={getNavLinkClass}>
            Tentang Kami
          </NavLink>
          <NavLink to="/kontak" className={getNavLinkClass}>
            Kontak
          </NavLink>
        </div>

        <div className="flex items-center gap-4">
          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-on-surface hover:text-primary cursor-pointer border-none bg-transparent flex items-center justify-center p-2"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Dropdown Panel */}
        {isMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-surface/95 backdrop-blur-lg border-b border-outline-variant/10 md:hidden flex flex-col p-6 gap-6 shadow-xl z-40 animate-fade-in transition-all">
            <NavLink
              to="/"
              className={getNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
              end
            >
              Beranda
            </NavLink>
            <NavLink
              to="/blog"
              className={getNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </NavLink>
            <NavLink
              to="/templates"
              className={getNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Template
            </NavLink>
            <NavLink
              to="/pricing"
              className={getNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Harga
            </NavLink>
            <NavLink
              to="/tentang-kami"
              className={getNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Tentang Kami
            </NavLink>
            <NavLink
              to="/kontak"
              className={getNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Kontak
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
