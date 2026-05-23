import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AboutPage() {
  const [activeTimeline, setActiveTimeline] = useState(2026);

  const timelineData = [
    {
      year: 2024,
      title: "Benih Inovasi & Rilis Alpha",
      desc: "Lahir dari sebuah garasi kecil di Bandung dengan misi mendemokratisasi akses digital untuk 100 pelaku UMKM lokal pertama."
    },
    {
      year: 2025,
      title: "Ekspansi Nasional & Cloud Scale",
      desc: "Menghubungkan lebih dari 5,000 toko aktif di seluruh Indonesia dan memperkenalkan teknologi optimasi SEO otomatis satu-klik."
    },
    {
      year: 2026,
      title: "Generasi Baru DagangMaker",
      desc: "Peluncuran mesin rendering kilat berbasis modular. Target mendigitalisasi 50,000 UMKM di seluruh nusantara."
    }
  ];

  return (
    <div className="bg-background text-on-surface overflow-hidden responsive-zoom-85">
      {/* 🌌 IMMERSIVE HERO HEADER */}
      <section className="relative pt-24 pb-20 md:pt-40 md:pb-36 bg-gradient-to-b from-primary-fixed/20 via-background to-background">
        {/* Ambient Blur Lights */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-primary-fixed/30 rounded-full blur-[140px] opacity-70"></div>
          <div className="absolute top-60 right-1/4 w-[400px] h-[400px] bg-secondary-container/30 rounded-full blur-[120px] opacity-50"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(115,92,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(115,92,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
          {/* Animated Capsule Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline/10 text-secondary font-label-md text-xs tracking-wider uppercase mb-8 shadow-sm hover:border-secondary-container/30 transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            MENGENAL LEBIH DEKAT DAGANGMAKER
          </div>
          
          <h1 className="font-display-lg text-4xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8 text-on-surface">
            Arsitek Digital untuk <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-secondary via-secondary-container to-primary bg-clip-text text-transparent">
              Masa Depan UMKM Indonesia
            </span>
          </h1>

          <p className="font-body-lg text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed mb-12">
            Kami bukan sekadar platform pembuat website. Kami adalah mitra pertumbuhan digital yang mendesain solusi tanpa kode (*no-code*) tercanggih, tercepat, dan paling fleksibel demi mengangkat produk lokal ke panggung global.
          </p>

          {/* Core Metrics Quick-Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto bg-surface-container-lowest/80 backdrop-blur-md p-6 rounded-3xl border border-outline-variant/30 shadow-xl">
            <div className="p-4 border-r border-outline-variant/10 last:border-0">
              <div className="font-headline-lg text-3xl md:text-4xl font-extrabold text-secondary">10k+</div>
              <div className="font-label-sm text-[10px] text-on-surface-variant tracking-widest uppercase mt-1">UMKM Aktif</div>
            </div>
            <div className="p-4 border-r border-outline-variant/10 last:border-0">
              <div className="font-headline-lg text-3xl md:text-4xl font-extrabold text-secondary">99.9%</div>
              <div className="font-label-sm text-[10px] text-on-surface-variant tracking-widest uppercase mt-1">SLA Uptime</div>
            </div>
            <div className="p-4 border-r border-outline-variant/10 last:border-0">
              <div className="font-headline-lg text-3xl md:text-4xl font-extrabold text-secondary">1.2s</div>
              <div className="font-label-sm text-[10px] text-on-surface-variant tracking-widest uppercase mt-1">Rata-Rata Load</div>
            </div>
            <div className="p-4 last:border-0">
              <div className="font-headline-lg text-3xl md:text-4xl font-extrabold text-secondary">24/7</div>
              <div className="font-label-sm text-[10px] text-on-surface-variant tracking-widest uppercase mt-1">Dukungan Ahli</div>
            </div>
          </div>
        </div>
      </section>

      {/* 🧱 SOPHISTICATED BENTO GRID (OUR CORE VALUES) */}
      <section className="py-24 bg-surface-container-lowest relative border-y border-outline-variant/20">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <span className="font-label-sm text-secondary tracking-widest uppercase">FILOSOFI KAMI</span>
              <h2 className="font-headline-lg text-3xl md:text-5xl font-black mt-2 text-on-surface">Didesain dengan Presisi, Dijalankan dengan Integritas</h2>
            </div>
            <p className="font-body-md text-on-surface-variant max-w-md leading-relaxed">
              Setiap elemen visual, struktur basis data, dan performa server diselaraskan secara ketat untuk menghadirkan kenyamanan kelas satu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1 (Large - Spans 2 cols on desktop) */}
            <div className="md:col-span-2 bg-background p-8 md:p-12 rounded-[32px] border border-outline-variant/30 flex flex-col justify-between group hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none group-hover:bg-primary-fixed/30 transition-all"></div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-on-secondary mb-8 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">auto_awesome</span>
                </div>
                <h3 className="font-headline-md text-2xl md:text-3xl font-extrabold mb-4 text-on-surface group-hover:text-secondary transition-colors">Digitalisasi Satu-Klik Tanpa Kode</h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed max-w-xl">
                  Kami percaya teknologi harus membebaskan, bukan membelenggu. Dengan sistem rendering visual canggih kami, siapapun bisa mempublikasikan website profesional, aman, dan berkelas dunia dalam waktu kurang dari 5 menit.
                </p>
              </div>
              <div className="flex items-center gap-4 mt-12 pt-6 border-t border-outline-variant/15">
                <span className="font-label-md text-secondary">Pelajari Teknologi Rendering Kami</span>
                <span className="material-symbols-outlined text-secondary group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </div>
            </div>

            {/* Bento Card 2 (Small - Spans 1 col) */}
            <div className="bg-background p-8 rounded-[32px] border border-outline-variant/30 flex flex-col justify-between group hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-8">
                  <span className="material-symbols-outlined text-3xl">speed</span>
                </div>
                <h3 className="font-headline-md text-2xl font-bold mb-4 text-on-surface">Performa Ekstrem</h3>
                <p className="font-body-sm text-on-surface-variant leading-relaxed">
                  Didukung infrastruktur CDN edge-distributed tercanggih. Halaman toko Anda dimuat secara instan di perangkat mana pun, meminimalkan bounce rate dan memaksimalkan retensi pelanggan.
                </p>
              </div>
              <div className="font-label-sm text-secondary uppercase tracking-widest mt-8">SPEED INDEX: A+</div>
            </div>

            {/* Bento Card 3 (Small - Spans 1 col) */}
            <div className="bg-background p-8 rounded-[32px] border border-outline-variant/30 flex flex-col justify-between group hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white mb-8">
                  <span className="material-symbols-outlined text-3xl">shield_locked</span>
                </div>
                <h3 className="font-headline-md text-2xl font-bold mb-4 text-on-surface">Privasi & Keamanan Enkripsi</h3>
                <p className="font-body-sm text-on-surface-variant leading-relaxed">
                  Setiap transaksi pelanggan dan database toko dilindungi enkripsi SSL tingkat tinggi serta arsitektur firewall berlapis demi kelangsungan bisnis Anda yang aman.
                </p>
              </div>
              <div className="font-label-sm text-secondary uppercase tracking-widest mt-8">ISO 27001 SECURE BASE</div>
            </div>

            {/* Bento Card 4 (Large - Spans 2 cols on desktop) */}
            <div className="md:col-span-2 bg-background p-8 md:p-12 rounded-[32px] border border-outline-variant/30 flex flex-col justify-between group hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-80 h-40 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-on-secondary mb-8">
                  <span className="material-symbols-outlined text-3xl">query_stats</span>
                </div>
                <h3 className="font-headline-md text-2xl md:text-3xl font-extrabold mb-4 text-on-surface">SEO & Analitik Terintegrasi secara Pintar</h3>
                <p className="font-body-md text-on-surface-variant leading-relaxed max-w-xl">
                  Website Anda sudah dioptimalkan dari dalam sejak pertama kali dibuat. Dengan sitemap dinamis otomatis dan struktur JSON-LD yang kompatibel dengan mesin telusur, bisnis Anda akan mudah ditemukan di halaman pertama Google.
                </p>
              </div>
              <div className="flex items-center gap-3 mt-12">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-label-sm text-on-surface-variant">Semua template lulus uji kompatibilitas Google Lighthouse</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🗺️ THE VISUAL ROADMAP (PETA JALAN INOVASI) */}
      <section className="py-24 bg-background relative">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="font-label-sm text-secondary tracking-widest uppercase">PETA JALAN INOVASI</span>
            <h2 className="font-headline-lg text-3xl md:text-5xl font-black mt-3 text-on-surface">Bagaimana Kami Bertumbuh Bersama Anda</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative">
            {/* Left Column: Interactive Switcher */}
            <div className="lg:col-span-4 flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
              {timelineData.map((item) => (
                <button
                  key={item.year}
                  onClick={() => setActiveTimeline(item.year)}
                  className={`flex-shrink-0 px-6 py-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                    activeTimeline === item.year
                      ? "bg-secondary text-on-secondary border-secondary shadow-lg scale-105"
                      : "bg-surface-container border-outline-variant/20 hover:border-secondary/30 text-on-surface"
                  }`}
                >
                  <span className="block font-label-sm opacity-60">FASE MILESTONE</span>
                  <span className="font-headline-sm text-xl font-bold">{item.year}</span>
                </button>
              ))}
            </div>

            {/* Right Column: Display Details */}
            <div className="lg:col-span-8 bg-surface-container-lowest p-8 md:p-12 rounded-[32px] border border-outline-variant/30 shadow-xl transition-all duration-500 relative min-h-[260px] flex flex-col justify-between">
              <div>
                <div className="inline-block px-4 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-xs mb-6 uppercase tracking-wider">
                  Tahun {activeTimeline}
                </div>
                <h3 className="font-headline-lg text-2xl md:text-4xl font-extrabold mb-4 text-on-surface">
                  {timelineData.find(t => t.year === activeTimeline)?.title}
                </h3>
                <p className="font-body-lg text-base md:text-lg text-on-surface-variant leading-relaxed">
                  {timelineData.find(t => t.year === activeTimeline)?.desc}
                </p>
              </div>
              <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden mt-12">
                <div 
                  className="h-full bg-secondary transition-all duration-500 rounded-full"
                  style={{ 
                    width: activeTimeline === 2024 ? '33%' : activeTimeline === 2025 ? '66%' : '100%' 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 👥 THE FOUNDERS & SCIENTIFIC TEAM (DARK CONTRAST) */}
      <section className="py-24 bg-inverse-surface text-inverse-on-surface relative">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="font-label-sm text-secondary-fixed tracking-widest uppercase">TIM IMPIAN KAMI</span>
            <h2 className="font-headline-lg text-3xl md:text-5xl font-black mt-3 text-white">Dibalik Layar DagangMaker</h2>
            <p className="font-body-md text-tertiary-fixed-dim mt-4 leading-relaxed">
              Para inovator, pemikir kreatif, dan teknolog tangguh yang berkolaborasi untuk merestrukturisasi lanskap digital bisnis Indonesia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-surface/5 p-8 rounded-3xl border border-white/5 group hover:bg-surface/10 hover:border-secondary-fixed/20 hover:-translate-y-2 transition-all duration-300 text-center">
              <div className="w-24 h-24 rounded-full bg-secondary-fixed/20 text-secondary-fixed flex items-center justify-center mx-auto mb-6 border border-secondary-fixed/10 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-4xl">engineering</span>
              </div>
              <h3 className="font-headline-sm text-xl font-bold mb-1 text-white">Muhammad Faiizr</h3>
              <p className="font-label-sm text-secondary-fixed/80 tracking-widest uppercase text-xs mb-4">Founder & Lead Architect</p>
              <p className="font-body-sm text-tertiary-fixed-dim leading-relaxed">
                Mengepalai arsitektur sistem, optimalisasi database relasional, dan mengontrol ketepatan performa infrastruktur komputasi awan.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-surface/5 p-8 rounded-3xl border border-white/5 group hover:bg-surface/10 hover:border-secondary-fixed/20 hover:-translate-y-2 transition-all duration-300 text-center">
              <div className="w-24 h-24 rounded-full bg-secondary-fixed/20 text-secondary-fixed flex items-center justify-center mx-auto mb-6 border border-secondary-fixed/10 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-4xl">palette</span>
              </div>
              <h3 className="font-headline-sm text-xl font-bold mb-1 text-white">Clara Adisutjipto</h3>
              <p className="font-label-sm text-secondary-fixed/80 tracking-widest uppercase text-xs mb-4">Head of UX & Product Design</p>
              <p className="font-body-sm text-tertiary-fixed-dim leading-relaxed">
                Bertanggung jawab penuh atas keindahan visual interface, kehalusan transisi animasi, dan konsistensi skema warna premium.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="bg-surface/5 p-8 rounded-3xl border border-white/5 group hover:bg-surface/10 hover:border-secondary-fixed/20 hover:-translate-y-2 transition-all duration-300 text-center">
              <div className="w-24 h-24 rounded-full bg-secondary-fixed/20 text-secondary-fixed flex items-center justify-center mx-auto mb-6 border border-secondary-fixed/10 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-4xl">rocket_launch</span>
              </div>
              <h3 className="font-headline-sm text-xl font-bold mb-1 text-white">Raka Pradana</h3>
              <p className="font-label-sm text-secondary-fixed/80 tracking-widest uppercase text-xs mb-4">VP of Growth & Community</p>
              <p className="font-body-sm text-tertiary-fixed-dim leading-relaxed">
                Berfokus penuh dalam mendengarkan setiap keluhan UMKM serta merancang program pendampingan go-digital nasional yang intensif.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 ELITE CALL-TO-ACTION */}
      <section className="py-24 relative overflow-hidden bg-background">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-fixed/20 rounded-full blur-[160px] opacity-60"></div>
        </div>

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 text-center">
          <h2 className="font-display-lg text-3xl md:text-5xl font-black mb-6 text-on-surface">Siap Mengukir Sejarah Bisnis Digital Anda?</h2>
          <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
            Bergabunglah dengan ribuan pelaku usaha tangguh lainnya yang telah melipatgandakan omset penjualan dengan website performa ekstrem DagangMaker.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-3 bg-secondary text-on-secondary font-label-md px-8 py-4 rounded-2xl hover:bg-secondary-container transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-secondary/20 border-none cursor-pointer"
          >
            Mulai Website Instan Anda Sekarang
            <span className="material-symbols-outlined">bolt</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
