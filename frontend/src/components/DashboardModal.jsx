import React from 'react';

function DashboardModal({ 
  isOpen, 
  onClose,
  isAuthenticated,
  user,
  token,
  activeTab,
  setActiveTab,
  backendStatus,
  usersList,
  loading,
  fetchUsersLoading,
  error,
  setError,
  success,
  setSuccess,
  formData,
  handleInputChange,
  handleLogin,
  handleRegister,
  handleLogout,
  fetchUsers
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay overflow-y-auto">
      {/* Background click to close */}
      <div className="absolute inset-0 bg-slate-950/40" onClick={onClose}></div>

      {/* Modal Container Card */}
      <div className="relative glass-card w-full max-w-6xl shadow-2xl p-6 md:p-8 flex flex-col gap-6 animate-scaleIn z-10 my-8">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-on-surface font-heading">DagangCommerce Hub</h2>
            <p className="text-xs text-on-surface-variant">Live GORM Auto-Migrations &amp; PostgreSQL synchronization portal</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-outline-variant/10 hover:bg-outline-variant/30 text-on-surface transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Content - Dual Panel */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT PANEL: Auth or Profile Card (45% Width Equivalent) */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            {!isAuthenticated ? (
              <div className="glass-card p-6 bg-white/40">
                {/* Authentication Tabs Toggle */}
                <div className="auth-tabs mb-6">
                  <button 
                    className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
                  >
                    Sign In
                  </button>
                  <button 
                    className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('register'); setError(''); setSuccess(''); }}
                  >
                    Create Account
                  </button>
                </div>

                {/* Status Banners */}
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {/* Form Logic */}
                {activeTab === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-4 text-left">
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        placeholder="e.g. admin@dagangcommerce.com"
                        className="form-input" 
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Password</label>
                      <input 
                        type="password" 
                        name="password"
                        required
                        placeholder="••••••••"
                        className="form-input" 
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
                      {loading ? <div className="spinner"></div> : 'Sign In to Hub'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4 text-left">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        placeholder="e.g. Alex Mercer"
                        className="form-input" 
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        placeholder="e.g. alex@example.com"
                        className="form-input" 
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Password (Min 6 chars)</label>
                      <input 
                        type="password" 
                        name="password"
                        required
                        placeholder="••••••••"
                        className="form-input" 
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
                      {loading ? <div className="spinner"></div> : 'Register Secure Account'}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              // Authenticated User Panel
              <div className="glass-card p-6 bg-white/60 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center font-bold text-2xl text-on-primary-fixed mb-4 shadow-inner border border-primary/20">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h3 className="text-xl font-extrabold text-on-surface font-heading">{user?.name}</h3>
                <p className="text-sm text-on-surface-variant mb-6">{user?.email}</p>

                {/* Session metadata info */}
                <div className="w-full bg-black/5 p-4 rounded-2xl border border-outline-variant/20 text-left space-y-3 mb-6">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-outline">Account UID</span>
                    <span className="text-on-surface">#{user?.id}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-outline">Auth Mode</span>
                    <span className="text-primary font-bold">JWT Token</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold items-center">
                    <span className="text-outline">Created Date</span>
                    <span className="text-on-surface">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }) : '-'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleLogout}
                  className="w-full py-3 bg-rose-50 hover:bg-rose-500 hover:text-white border border-rose-200 text-rose-600 rounded-xl transition-all font-bold text-sm cursor-pointer hover:shadow-lg hover:shadow-rose-500/10"
                >
                  Disconnect Session
                </button>
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Live Database Sync Board (55% Width Equivalent) */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            <div className="glass-card p-6 bg-white/40 flex-1 flex flex-col min-h-[380px]">
              
              {/* Header Sync tools */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-left">
                  <h3 className="text-lg font-bold text-on-surface font-heading">PostgreSQL Ledger</h3>
                  <p className="text-[11px] text-on-surface-variant">Live users records dynamically synchronized using GORM</p>
                </div>
                {isAuthenticated && (
                  <button 
                    onClick={() => fetchUsers()} 
                    disabled={fetchUsersLoading}
                    className="flex items-center gap-1 bg-white hover:bg-black/5 text-xs font-bold px-3 py-1.5 rounded-lg border border-outline-variant/60 shadow-sm cursor-pointer transition-all active:scale-95 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">sync</span>
                    {fetchUsersLoading ? 'Syncing...' : 'Sync Board'}
                  </button>
                )}
              </div>

              {/* Dynamic View rendering depending on auth state */}
              {!isAuthenticated ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="text-4xl mb-4 opacity-75">🔒</div>
                  <h4 className="text-base font-extrabold text-on-surface mb-1">Database Ledger Locked</h4>
                  <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
                    Please log in or register a new business profile in the left panel to retrieve and decrypt users list in real-time from the database.
                  </p>
                </div>
              ) : fetchUsersLoading && usersList.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="spinner border-primary border-t-transparent mb-4"></div>
                  <p className="text-xs text-on-surface-variant font-semibold">Decrypting database tables...</p>
                </div>
              ) : usersList.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="text-4xl mb-4 opacity-50">📭</div>
                  <h4 className="text-base font-extrabold text-on-surface mb-1">No Database Records</h4>
                  <p className="text-xs text-on-surface-variant">This should not occur since seeders populate data on boot.</p>
                </div>
              ) : (
                <div className="overflow-x-auto flex-1 max-h-[300px] overflow-y-auto pr-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant/20 text-xs font-bold text-outline uppercase tracking-wider">
                        <th className="py-2.5 px-3">User Profile</th>
                        <th className="py-2.5 px-3">Joined Date</th>
                        <th className="py-2.5 px-3 text-right">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-black/5 transition-colors">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-3">
                              <div className="avatar-sm">
                                {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div className="text-left">
                                <div className="text-xs font-extrabold text-on-surface">{u.name}</div>
                                <div className="text-[10px] text-on-surface-variant">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-xs text-on-surface-variant">
                            {new Date(u.created_at).toLocaleDateString('id-ID', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className="user-badge">
                              {u.id === 1 ? 'Admin Root' : 'Buyer Account'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default DashboardModal;
