import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login gagal. Periksa kredensial Anda.');
      }

      // Simpan token dan data user ke Local Storage
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      
      // Arahkan ke dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-xl w-full max-w-md border border-outline-variant/50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-container text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-4xl">shield_person</span>
          </div>
          <h1 className="text-3xl font-headline-lg font-bold text-on-surface mb-2">DagangMaker</h1>
          <p className="text-secondary font-body-md">Portal Manajemen Super Admin</p>
        </div>

        {error && (
          <div className="bg-error/10 text-error p-4 rounded-xl mb-6 text-sm border border-error/20 flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-label-md text-on-surface-variant mb-2">Alamat Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="superadmin@dagangmaker.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-label-md text-on-surface-variant mb-2">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-primary text-on-primary font-label-md py-3.5 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer border-none flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              'Masuk ke Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
