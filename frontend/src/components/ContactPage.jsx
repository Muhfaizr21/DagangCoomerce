import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8000';

function ContactPage() {
  const navigate = useNavigate();

  // Form input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null); // stores ticket data on success

  // Field touch states for real-time validation visual cues
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isEmailValid = (emailStr) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Trigger touched on all fields
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    // Validations
    if (!name.trim()) {
      setError('Mohon masukkan Nama Lengkap Anda.');
      return;
    }
    if (!email.trim() || !isEmailValid(email)) {
      setError('Mohon masukkan Alamat Email yang valid.');
      return;
    }
    if (!subject.trim()) {
      setError('Mohon tentukan Subjek Pesan.');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      setError('Pesan bantuan Anda harus minimal 10 karakter.');
      return;
    }

    setLoading(true);

    try {
      // Sync seamlessly with public endpoint
      const response = await axios.post(`${BACKEND_URL}/api/tickets`, {
        customer: name,
        email: email,
        title: subject,
        description: message,
      });

      // Set successful checkout ticket data
      setSuccessData(response.data);
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTouched({ name: false, email: false, subject: false, message: false });
    } catch (err) {
      console.error('Failed to submit public contact form:', err);
      const errMsg = err.response?.data?.error || 'Gagal mengirimkan pesan. Silakan coba beberapa saat lagi.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen overflow-hidden relative">
      {/* 🌌 IMMERSIVE HERO BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-primary-fixed/20 rounded-full blur-[150px] opacity-70"></div>
        <div className="absolute top-80 right-1/4 w-[500px] h-[500px] bg-secondary-container/20 rounded-full blur-[130px] opacity-60"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(115,92,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(115,92,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 relative z-10">
        
        {/* Animated Capsule Badge */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline/10 text-primary font-label-md text-xs tracking-wider uppercase mb-6 shadow-sm hover:border-primary/30 transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            PUSAT BANTUAN AKTIF & DIREKTORAT HUBUNGAN
          </div>
          <h1 className="font-display-lg text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-on-surface">
            Hubungi Kami
          </h1>
          <p className="font-body-md text-secondary max-w-2xl mx-auto mt-4 leading-relaxed">
            Ada pertanyaan tentang integrasi, lisensi, atau kendala teknis? Hubungi kami dan kiriman pesan Anda akan otomatis disinkronkan langsung ke panel Helpdesk Admin kami.
          </p>
        </div>

        {/* MAIN SPLIT CARD PANELS */}
        {!successData ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto mt-8">
            
            {/* LEFT COLUMN: COMPANY INFORMATIONS */}
            <div className="lg:col-span-5 bg-surface-container-lowest/80 backdrop-blur-xl p-8 rounded-[32px] border border-outline-variant/30 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div>
                <h2 className="font-headline-md text-2xl font-black mb-6 text-on-surface">Info Hub Bantuan</h2>
                <p className="font-body-md text-secondary leading-relaxed mb-8">
                  Kami mengoperasikan Helpdesk pusat bantuan terpusat untuk memastikan setiap keluhan dan masukan terlayani dengan presisi dalam waktu singkat.
                </p>

                <div className="space-y-6">
                  {/* Contact Info Item 1 */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed shadow-sm flex-shrink-0">
                      <span className="material-symbols-outlined text-2xl">mail</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-sm font-bold text-on-surface">Email Dukungan</h4>
                      <p className="font-body-sm text-secondary mt-0.5">support@dagangmaker.com</p>
                      <p className="text-[11px] text-primary font-semibold mt-1">Estimasi respons: &lt; 2 jam</p>
                    </div>
                  </div>

                  {/* Contact Info Item 2 */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-sm flex-shrink-0">
                      <span className="material-symbols-outlined text-2xl">schedule</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-sm font-bold text-on-surface">Jam Operasional</h4>
                      <p className="font-body-sm text-secondary mt-0.5">Senin - Sabtu, 08:00 - 18:00 WIB</p>
                      <p className="text-[11px] text-outline font-semibold mt-1">Dukungan darurat aktif 24 jam</p>
                    </div>
                  </div>

                  {/* Contact Info Item 3 */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                      <span className="material-symbols-outlined text-2xl">location_on</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-sm font-bold text-on-surface">Kantor Pusat</h4>
                      <p className="font-body-sm text-secondary mt-0.5">Jl. Asia Afrika No. 120, Lengkong</p>
                      <p className="font-body-sm text-secondary">Bandung, Jawa Barat 40261</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-outline-variant/15 flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="font-label-sm text-xs text-secondary font-semibold">Semua agen helpdesk dalam status Online</span>
              </div>
            </div>

            {/* RIGHT COLUMN: CONTACT FORM */}
            <div className="lg:col-span-7 bg-surface-container-lowest/80 backdrop-blur-xl p-8 md:p-10 rounded-[32px] border border-outline-variant/30 shadow-xl relative overflow-hidden">
              <h2 className="font-headline-md text-2xl font-black mb-2 text-on-surface">Kirim Pesan Bantuan</h2>
              <p className="font-body-sm text-secondary mb-6 leading-relaxed">
                Silakan lengkapi formulir di bawah ini dengan akurat untuk mempermudah identifikasi masalah oleh tim teknis kami.
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-error-container/50 border border-error-container text-on-error-container text-xs font-semibold flex items-center gap-3 animate-in fade-in duration-200">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Fullname input */}
                <div>
                  <label className="block font-label-md text-xs font-bold text-on-surface mb-2 pl-1">Nama Lengkap</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => handleBlur('name')}
                      placeholder="Masukkan nama lengkap Anda"
                      className={`w-full pl-12 pr-4 py-3 bg-surface-container-lowest border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                        touched.name && !name.trim() 
                          ? 'border-error-container focus:border-error-container' 
                          : 'border-outline-variant focus:border-[#001A3D]'
                      }`}
                    />
                  </div>
                  {touched.name && !name.trim() && (
                    <p className="text-[11px] text-error-container font-semibold mt-1 pl-1">Nama tidak boleh kosong.</p>
                  )}
                </div>

                {/* Email input */}
                <div>
                  <label className="block font-label-md text-xs font-bold text-on-surface mb-2 pl-1">Alamat Email</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => handleBlur('email')}
                      placeholder="contoh@domain.com"
                      className={`w-full pl-12 pr-4 py-3 bg-surface-container-lowest border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                        touched.email && (!email.trim() || !isEmailValid(email))
                          ? 'border-error-container focus:border-error-container' 
                          : 'border-outline-variant focus:border-[#001A3D]'
                      }`}
                    />
                  </div>
                  {touched.email && !email.trim() && (
                    <p className="text-[11px] text-error-container font-semibold mt-1 pl-1">Email tidak boleh kosong.</p>
                  )}
                  {touched.email && email.trim() && !isEmailValid(email) && (
                    <p className="text-[11px] text-error-container font-semibold mt-1 pl-1">Format email tidak valid.</p>
                  )}
                </div>

                {/* Subject/Title input */}
                <div>
                  <label className="block font-label-md text-xs font-bold text-on-surface mb-2 pl-1">Subjek Masalah</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">subject</span>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      onBlur={() => handleBlur('subject')}
                      placeholder="Contoh: Kendala Domain Kustom"
                      className={`w-full pl-12 pr-4 py-3 bg-surface-container-lowest border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                        touched.subject && !subject.trim() 
                          ? 'border-error-container focus:border-error-container' 
                          : 'border-outline-variant focus:border-[#001A3D]'
                      }`}
                    />
                  </div>
                  {touched.subject && !subject.trim() && (
                    <p className="text-[11px] text-error-container font-semibold mt-1 pl-1">Subjek pesan wajib diisi.</p>
                  )}
                </div>

                {/* Message detail input */}
                <div>
                  <label className="block font-label-md text-xs font-bold text-on-surface mb-2 pl-1">Detail Pesan Bantuan</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onBlur={() => handleBlur('message')}
                    placeholder="Tuliskan pesan atau kendala Anda secara terperinci..."
                    rows="4"
                    className={`w-full p-4 bg-surface-container-lowest border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                      touched.message && (!message.trim() || message.trim().length < 10)
                        ? 'border-error-container focus:border-error-container' 
                        : 'border-outline-variant focus:border-[#001A3D]'
                    }`}
                  ></textarea>
                  <div className="flex justify-between items-center mt-1 pl-1 pr-1">
                    {touched.message && !message.trim() ? (
                      <p className="text-[11px] text-error-container font-semibold">Pesan tidak boleh kosong.</p>
                    ) : touched.message && message.trim().length < 10 ? (
                      <p className="text-[11px] text-error-container font-semibold">Pesan terlalu pendek (minimal 10 karakter).</p>
                    ) : (
                      <div></div>
                    )}
                    <span className="text-[10px] text-outline font-semibold">Panjang pesan: {message.length} karakter</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#001A3D] text-white font-label-md px-6 py-4 rounded-2xl hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-[#001A3D]/10 cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-2 border-none"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
                      Mengirimkan Bantuan...
                    </>
                  ) : (
                    <>
                      Kirim Pesan Bantuan
                      <span className="material-symbols-outlined text-[18px]">send</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          
          /* ANIMATED SUCCESS SCREEN: MONTERO GLOW CARD */
          <div className="max-w-xl mx-auto bg-surface-container-lowest/90 backdrop-blur-2xl p-10 rounded-[40px] border border-outline-variant/30 shadow-2xl text-center relative overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-72 h-72 bg-green-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce">
              <span className="material-symbols-outlined text-4xl font-black">check_circle</span>
            </div>

            <h2 className="font-headline-lg text-3xl font-black text-on-surface mb-3">Pesan Berhasil Disinkronkan!</h2>
            <p className="font-body-md text-secondary leading-relaxed mb-6">
              Terima kasih, pesan bantuan Anda telah terdaftar dan terintegrasi langsung dengan sistem Helpdesk DagangMaker.
            </p>

            {/* Generated ticket info layout */}
            <div className="bg-surface-container-low border border-outline-variant/20 rounded-3xl p-6 mb-8 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
              
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-outline-variant/20">
                <span className="font-label-sm text-xs text-outline font-bold uppercase tracking-wider">KODE TIKET DUKUNGAN</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#001A3D]/10 text-[#001A3D] text-[10px] font-bold uppercase tracking-wide">ACTIVE</span>
              </div>
              
              <div className="font-mono text-4xl font-extrabold text-primary text-center tracking-wider py-2">
                {successData.ticket_id}
              </div>
              
              <div className="mt-4 space-y-1.5 text-xs text-on-surface-variant font-medium">
                <p>• Pelapor: <strong className="text-on-surface">{successData.customer}</strong></p>
                <p>• Email: <strong className="text-on-surface">{successData.email}</strong></p>
                <p>• Prioritas: <strong className="text-on-surface">{successData.priority}</strong></p>
                <p>• Subjek: <strong className="text-on-surface">{successData.title}</strong></p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary-fixed/15 border border-primary-fixed/20 text-primary font-semibold text-xs leading-relaxed mb-8">
              Pemberitahuan balasan beserta salinan pesan telah dikirimkan ke email Anda. Gunakan kode tiket di atas saat melakukan korespondensi lanjutan.
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setSuccessData(null)}
                className="flex-1 bg-surface-container text-on-surface border border-outline-variant font-label-md px-5 py-4 rounded-2xl hover:bg-surface-container-high active:scale-[0.98] transition-all cursor-pointer"
              >
                Kirim Pesan Baru
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 bg-[#001A3D] text-white font-label-md px-5 py-4 rounded-2xl hover:opacity-95 active:scale-[0.98] transition-all shadow-md hover:shadow-[#001A3D]/10 cursor-pointer border-none"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactPage;
