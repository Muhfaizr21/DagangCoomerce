import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

function Settings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Settings states initialized with sensible premium defaults or persisted values
  const [activeTab, setActiveTab] = useState('general'); // general | merchant | security | integrations

  const [generalSettings, setGeneralSettings] = useState(() => {
    const saved = localStorage.getItem('admin_settings_general');
    return saved ? JSON.parse(saved) : {
      platformName: 'DagangCommerce',
      tagline: 'Solusi E-Commerce Multi-Tenant Terpercaya',
      brandColor: '#001A3D',
      maintenanceMode: false,
      supportEmail: 'support@dagangcommerce.com',
      logoUrl: '',
    };
  });

  const [merchantSettings, setMerchantSettings] = useState(() => {
    const saved = localStorage.getItem('admin_settings_merchant');
    return saved ? JSON.parse(saved) : {
      defaultCommission: 2.5,
      autoApproveStores: true,
      allowedCustomDomains: true,
      trialDays: 14,
      limitProductsPerStore: 100,
    };
  });

  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 60, // in minutes
    mfaEnabled: false,
    restrictIps: '',
    passwordMinLength: 8,
  });

  const [integrationSettings, setIntegrationSettings] = useState(() => {
    const saved = localStorage.getItem('admin_settings_integrations');
    return saved ? JSON.parse(saved) : {
      paymentGateway: 'Midtrans',
      midtransApiKey: 'SB-Mid-server-xxxxxxxxxxxx',
      smtpHost: 'smtp.dagangcommerce.com',
      smtpPort: 587,
      smtpUser: 'notifier@dagangcommerce.com',
      webhookUrl: 'http://localhost:8000/api/webhooks/payment',
    };
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('admin_settings_general', JSON.stringify(generalSettings));
      setLoading(false);
      triggerToast('General settings updated successfully!');
    }, 600);
  };

  const handleSaveMerchant = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('admin_settings_merchant', JSON.stringify(merchantSettings));
      setLoading(false);
      triggerToast('Merchant control policies saved!');
    }, 600);
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('admin_settings_security', JSON.stringify(securitySettings));
      setLoading(false);
      triggerToast('Security protocols updated!');
    }, 600);
  };

  const handleSaveIntegrations = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('admin_settings_integrations', JSON.stringify(integrationSettings));
      setLoading(false);
      triggerToast('API integration credentials updated!');
    }, 600);
  };

  return (
    <div className="bg-background text-on-surface antialiased overflow-hidden flex h-screen w-full">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
        <TopNav title="Platform Settings" />

        {/* Global Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[9999] bg-[#001A3D] text-white px-5 py-3.5 rounded-xl border border-white/10 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200">
            <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto mt-16 p-6 md:p-10 bg-background">
          <div className="max-w-[1200px] mx-auto space-y-8 pb-12">
            
            {/* Header section */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary">Settings</h2>
              <p className="text-sm text-on-surface-variant mt-1.5 font-medium">Configure global tenant rules, payment integrations, visual systems, and portal security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Settings Nav Tabs */}
              <div className="lg:col-span-1 space-y-1.5">
                {[
                  { id: 'general', icon: 'settings', label: 'General' },
                  { id: 'merchant', icon: 'storefront', label: 'Merchant Policies' },
                  { id: 'security', icon: 'security', label: 'Admin Security' },
                  { id: 'integrations', icon: 'api', label: 'API Integrations' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-xs border-none cursor-pointer transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#001A3D] text-white shadow-sm'
                        : 'bg-transparent text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Settings Action forms */}
              <div className="lg:col-span-3">
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-6 md:p-8">
                  
                  {/* --- GENERAL SETTINGS --- */}
                  {activeTab === 'general' && (
                    <form onSubmit={handleSaveGeneral} className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-primary">General Configuration</h3>
                        <p className="text-xs text-on-surface-variant mt-0.5 font-medium">Visual brand alignment and basic details for the overall DagangCommerce engine.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Platform Brand Name</label>
                          <input
                            type="text"
                            required
                            value={generalSettings.platformName}
                            onChange={e => setGeneralSettings({ ...generalSettings, platformName: e.target.value })}
                            className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:border-secondary bg-surface transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Support Center Email</label>
                          <input
                            type="email"
                            required
                            value={generalSettings.supportEmail}
                            onChange={e => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                            className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:border-secondary bg-surface transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Platform Tagline / Slogan</label>
                        <input
                          type="text"
                          required
                          value={generalSettings.tagline}
                          onChange={e => setGeneralSettings({ ...generalSettings, tagline: e.target.value })}
                          className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:border-secondary bg-surface transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Primary System HSL / Brand Color</label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={generalSettings.brandColor}
                              onChange={e => setGeneralSettings({ ...generalSettings, brandColor: e.target.value })}
                              className="w-12 h-10 border border-outline-variant rounded-lg cursor-pointer bg-surface p-1"
                            />
                            <input
                              type="text"
                              required
                              value={generalSettings.brandColor}
                              onChange={e => setGeneralSettings({ ...generalSettings, brandColor: e.target.value })}
                              className="flex-1 px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-mono font-semibold focus:outline-none focus:border-secondary bg-surface transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Platform Logo URL</label>
                          <input
                            type="text"
                            value={generalSettings.logoUrl}
                            onChange={e => setGeneralSettings({ ...generalSettings, logoUrl: e.target.value })}
                            placeholder="https://example.com/logo.png (defaults to D icon)"
                            className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:border-secondary bg-surface transition-all"
                          />
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-surface-container/50 border border-outline-variant/30 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-primary">Emergency Maintenance Mode</p>
                          <p className="text-[10px] text-on-surface-variant font-medium">Instantly display a clean, aesthetic maintenance screens across all storefronts and admin tools.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={generalSettings.maintenanceMode}
                            onChange={e => setGeneralSettings({ ...generalSettings, maintenanceMode: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                        </label>
                      </div>

                      <div className="pt-4 border-t border-outline-variant/20 flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-[#001A3D] text-white px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none shadow-sm disabled:opacity-70"
                        >
                          {loading ? (
                            <>
                              <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                              Saving...
                            </>
                          ) : (
                            'Save General Changes'
                          )}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* --- MERCHANT POLICIES --- */}
                  {activeTab === 'merchant' && (
                    <form onSubmit={handleSaveMerchant} className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-primary">Merchant Platform Control</h3>
                        <p className="text-xs text-on-surface-variant mt-0.5 font-medium">Define commissioning scales, validation states, and default parameters for store operators.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Platform Default Commission (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            required
                            value={merchantSettings.defaultCommission}
                            onChange={e => setMerchantSettings({ ...merchantSettings, defaultCommission: parseFloat(e.target.value) })}
                            className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:border-secondary bg-surface transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Standard Trial Span (Days)</label>
                          <input
                            type="number"
                            required
                            value={merchantSettings.trialDays}
                            onChange={e => setMerchantSettings({ ...merchantSettings, trialDays: parseInt(e.target.value) })}
                            className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:border-secondary bg-surface transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Max Products per Store (Catalog Limit)</label>
                        <input
                          type="number"
                          required
                          value={merchantSettings.limitProductsPerStore}
                          onChange={e => setMerchantSettings({ ...merchantSettings, limitProductsPerStore: parseInt(e.target.value) })}
                          className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:border-secondary bg-surface transition-all"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-surface-container/50 border border-outline-variant/30 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-primary">Auto-Approve Created Stores</p>
                            <p className="text-[10px] text-on-surface-variant font-medium">Bypass admin validation checks so new merchants can immediately access their public link storefronts.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={merchantSettings.autoApproveStores}
                              onChange={e => setMerchantSettings({ ...merchantSettings, autoApproveStores: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                          </label>
                        </div>

                        <div className="p-4 rounded-xl bg-surface-container/50 border border-outline-variant/30 flex items-center justify-between">
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-primary">Allow Custom Domains</p>
                            <p className="text-[10px] text-on-surface-variant font-medium">Enable elite mapping properties so premium merchants can redirect custom CNAME DNS targets to storefronts.</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={merchantSettings.allowedCustomDomains}
                              onChange={e => setMerchantSettings({ ...merchantSettings, allowedCustomDomains: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                          </label>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-outline-variant/20 flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-[#001A3D] text-white px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none shadow-sm disabled:opacity-70"
                        >
                          {loading ? (
                            <>
                              <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                              Saving...
                            </>
                          ) : (
                            'Save Merchant Policies'
                          )}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* --- ADMIN SECURITY --- */}
                  {activeTab === 'security' && (
                    <form onSubmit={handleSaveSecurity} className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-primary">Admin Access & Security</h3>
                        <p className="text-xs text-on-surface-variant mt-0.5 font-medium">Establish verification criteria, session timers, and network credentials for admin users.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Session Expiry Time (Minutes)</label>
                          <input
                            type="number"
                            required
                            value={securitySettings.sessionTimeout}
                            onChange={e => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                            className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:border-secondary bg-surface transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Password Minimum Complexity Length</label>
                          <input
                            type="number"
                            required
                            value={securitySettings.passwordMinLength}
                            onChange={e => setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(e.target.value) })}
                            className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:border-secondary bg-surface transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">IP Whitelist Restrict (Comma-separated)</label>
                        <input
                          type="text"
                          value={securitySettings.restrictIps}
                          onChange={e => setSecuritySettings({ ...securitySettings, restrictIps: e.target.value })}
                          placeholder="e.g. 192.168.1.1, 10.0.0.1 (Leave empty to allow all)"
                          className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:border-secondary bg-surface transition-all"
                        />
                      </div>

                      <div className="p-4 rounded-xl bg-surface-container/50 border border-outline-variant/30 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-primary">Enforce Multi-Factor Auth (MFA)</p>
                          <p className="text-[10px] text-on-surface-variant font-medium">Mandate TOTP verification codes for all administrators checking CMS, templates, or orders.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securitySettings.mfaEnabled}
                            onChange={e => setSecuritySettings({ ...securitySettings, mfaEnabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                        </label>
                      </div>

                      <div className="pt-4 border-t border-outline-variant/20 flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-[#001A3D] text-white px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none shadow-sm disabled:opacity-70"
                        >
                          {loading ? (
                            <>
                              <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                              Saving...
                            </>
                          ) : (
                            'Apply Access Changes'
                          )}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* --- API INTEGRATIONS --- */}
                  {activeTab === 'integrations' && (
                    <form onSubmit={handleSaveIntegrations} className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-primary">Integrations & API Ecosystem</h3>
                        <p className="text-xs text-on-surface-variant mt-0.5 font-medium">Link transaction brokers, dynamic notification servers, and backend sync destinations.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Payment Gateway Broker</label>
                          <select
                            value={integrationSettings.paymentGateway}
                            onChange={e => setIntegrationSettings({ ...integrationSettings, paymentGateway: e.target.value })}
                            className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:border-secondary bg-surface transition-all"
                          >
                            <option value="Midtrans">Midtrans (Indonesia)</option>
                            <option value="Stripe">Stripe (Global)</option>
                            <option value="Xendit">Xendit (ASEAN)</option>
                            <option value="None">Direct Bank Transfer</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Payment Private API / Server Key</label>
                          <input
                            type="password"
                            required
                            value={integrationSettings.midtransApiKey}
                            onChange={e => setIntegrationSettings({ ...integrationSettings, midtransApiKey: e.target.value })}
                            className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:border-secondary bg-surface transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">SMTP Host Address</label>
                          <input
                            type="text"
                            required
                            value={integrationSettings.smtpHost}
                            onChange={e => setIntegrationSettings({ ...integrationSettings, smtpHost: e.target.value })}
                            className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:border-secondary bg-surface transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">SMTP Server Port</label>
                          <input
                            type="number"
                            required
                            value={integrationSettings.smtpPort}
                            onChange={e => setIntegrationSettings({ ...integrationSettings, smtpPort: parseInt(e.target.value) })}
                            className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:border-secondary bg-surface transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">SMTP Sender Username</label>
                          <input
                            type="email"
                            required
                            value={integrationSettings.smtpUser}
                            onChange={e => setIntegrationSettings({ ...integrationSettings, smtpUser: e.target.value })}
                            className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:border-secondary bg-surface transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Global Webhook URL Endpoint</label>
                          <input
                            type="text"
                            required
                            value={integrationSettings.webhookUrl}
                            onChange={e => setIntegrationSettings({ ...integrationSettings, webhookUrl: e.target.value })}
                            className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-semibold focus:outline-none focus:border-secondary bg-surface transition-all"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-outline-variant/20 flex justify-end">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-[#001A3D] text-white px-6 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none shadow-sm disabled:opacity-70"
                        >
                          {loading ? (
                            <>
                              <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                              Saving...
                            </>
                          ) : (
                            'Save Integration Keys'
                          )}
                        </button>
                      </div>
                    </form>
                  )}

                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Settings;
