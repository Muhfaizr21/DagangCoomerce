import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="w-full py-12 px-margin-mobile md:px-margin-desktop border-t border-outline-variant/30 bg-surface-container-low text-left">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-sm">
                <div className="font-headline-md text-headline-md text-primary mb-4">DagangMaker</div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">Professional Website Builder for Small Businesses.</p>
                <div className="flex gap-4">
                    <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">public</span>
                    <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">language</span>
                    <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">mail</span>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                <div className="flex flex-col gap-4 text-left">
                    <span className="font-label-md text-label-md text-on-surface font-bold">Product</span>
                    <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary no-underline" href="/#features">Features</a>
                    <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary no-underline" to="/templates">Templates</Link>
                    <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary no-underline" to="/pricing">Pricing</Link>
                </div>
                <div className="flex flex-col gap-4 text-left">
                    <span className="font-label-md text-label-md text-on-surface font-bold">Company</span>
                    <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary no-underline" to="/tentang-kami">Tentang Kami</Link>
                    <Link className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary no-underline" to="/kontak">Hubungi Kami</Link>
                    <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary no-underline" href="#">Privacy Policy</a>
                    <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary no-underline" href="#">Terms of Service</a>
                </div>
            </div>
        </div>
        <div className="max-w-container-max mx-auto mt-12 pt-8 border-t border-outline-variant/30 text-center">
            <p className="font-label-sm text-label-sm text-outline">© {new Date().getFullYear()} DagangMaker. Professional Website Builder for Small Businesses.</p>
        </div>
    </footer>
  );
}

export default Footer;
