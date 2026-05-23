import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Component Imports
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import LayoutComparison from './components/LayoutComparison';
import Footer from './components/Footer';
import DashboardModal from './components/DashboardModal';
import TemplatesPage from './components/TemplatesPage';
import PricingPage from './components/PricingPage';
import TrustedBy from './components/TrustedBy';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CtaSection from './components/CtaSection';
import BlogPage from './components/BlogPage';
import BlogDetailPage from './components/BlogDetailPage';

// Admin Components
import AdminLogin from './components/admin/LoginPage';
import AdminDashboard from './components/admin/Dashboard';
import CMS from './components/admin/CMS';
import Customers from './components/admin/Customers';
import Helpdesk from './components/admin/Helpdesk';
import Orders from './components/admin/Orders';
import Promotions from './components/admin/Promotions';
import Templates from './components/admin/Templates';
import AdminSettings from './components/admin/Settings';



import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';

const BACKEND_URL = 'http://localhost:8000';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPage = location.pathname.startsWith('/admin');

  // 1. Core Authentication & Session State
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || '');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usersList, setUsersList] = useState([]);

  // 2. Interactive Dialog / Drawer State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // login | register
  const [backendStatus, setBackendStatus] = useState('checking'); // checking | online | offline

  // 3. Async Loading & Alert States
  const [loading, setLoading] = useState(false);
  const [fetchUsersLoading, setFetchUsersLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 4. Form inputs state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // 5. Initial hook lifecycle
  useEffect(() => {
    checkBackendHealth();
    if (token) {
      loadSession(token);
    }
  }, []);

  // 6. Backend Integration Hooks
  const checkBackendHealth = async () => {
    try {
      setBackendStatus('checking');
      const response = await axios.get(BACKEND_URL);
      if (response.data && response.data.status === 'healthy') {
        setBackendStatus('online');
      } else {
        setBackendStatus('offline');
      }
    } catch (err) {
      console.error("Backend health check failed:", err);
      setBackendStatus('offline');
    }
  };

  const loadSession = async (sessionToken) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      setUser(res.data.data);
      setIsAuthenticated(true);
      fetchUsers(sessionToken);
    } catch (err) {
      console.error("Session profile expired or invalid:", err);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (sessionToken = token) => {
    if (!sessionToken) return;
    try {
      setFetchUsersLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/users`, {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      setUsersList(res.data.data || []);
    } catch (err) {
      console.error("Failed to sync database users listing:", err);
    } finally {
      setFetchUsersLoading(false);
    }
  };

  // 7. Input and Submission Event Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await axios.post(`${BACKEND_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      setSuccess('Account created successfully! Please sign in in the tab above.');
      setActiveTab('login');
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors || 'Registration failed. Check password length.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      });

      const { token: jwtToken, user: userProfile } = res.data.data;

      localStorage.setItem('jwt_token', jwtToken);
      setToken(jwtToken);
      setUser(userProfile);
      setIsAuthenticated(true);
      setFormData({ name: '', email: '', password: '' });

      // Simple login success handling: sync users list, show toast, and close login modal
      fetchUsers(jwtToken);
      setSuccess('Welcome back! Authentication validated.');
      setIsModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password credentials.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setToken('');
    setUser(null);
    setIsAuthenticated(false);
    setUsersList([]);
    setSuccess('Disconnected session.');
    setError('');
  };

  return (
    <div className="bg-background text-on-surface min-h-screen">
      {/* 🧭 Navigation Panel */}
      {!isAdminPage && (
        <Navbar
          onLoginClick={() => setIsModalOpen(true)}
          backendStatus={backendStatus}
          onHealthCheck={checkBackendHealth}
        />
      )}

      {/* 🚀 Main Body */}
      <main className={`${isAdminPage ? '' : 'pt-20'} overflow-x-hidden`}>
        <Routes>
          <Route path="/" element={
            <>
              {/* Intro Hero with Database drawer bindings */}
              <Hero onCtaClick={() => setIsModalOpen(true)} />

              {/* Social Proof Trust Bar */}
              <TrustedBy />

              {/* Feature Cards Grid */}
              <Features />

              {/* Simple Step-by-Step Guide */}
              <HowItWorks />

              {/* Template Layouts Slider Section */}
              <LayoutComparison />

              {/* Customer Reviews & Trust */}
              <Testimonials />


              {/* SEO Optimized FAQ */}
              <FAQ />

              {/* Final Push Call to Action */}
              <CtaSection onCtaClick={() => setIsModalOpen(true)} />
            </>
          } />
          <Route path="/templates" element={<TemplatesPage onSelectTemplate={(name) => alert(`Selected ${name} template!`)} />} />
          <Route path="/pricing" element={<PricingPage onSelectPlan={(name) => alert(`Selected ${name} plan!`)} />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />

          {/* Admin System Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/cms" element={<CMS />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/helpdesk" element={<Helpdesk />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/promotions" element={<Promotions />} />
          <Route path="/admin/templates" element={<Templates />} />
          <Route path="/admin/settings" element={<AdminSettings />} />



          {/* Public About Page */}
          <Route path="/tentang-kami" element={<AboutPage />} />
          <Route path="/kontak" element={<ContactPage />} />
        </Routes>
      </main>

      {/* 📦 Brand Footer */}
      {!isAdminPage && <Footer />}

      {/* 🔮 Connected Database & Security Drawer Portal */}
      <DashboardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isAuthenticated={isAuthenticated}
        user={user}
        token={token}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        usersList={usersList}
        loading={loading}
        fetchUsersLoading={fetchUsersLoading}
        error={error}
        setError={setError}
        success={success}
        setSuccess={setSuccess}
        formData={formData}
        handleInputChange={handleInputChange}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        handleLogout={handleLogout}
        fetchUsers={fetchUsers}
      />
    </div>
  );
}

export default App;
