import React from 'react';

function HowItWorks() {
  const steps = [
    {
      icon: 'touch_app',
      title: 'Pilih Template Website',
      desc: 'Pilih desain website responsif dari galeri template kami yang dirancang khusus untuk toko online, restoran, dan jasa profesional.'
    },
    {
      icon: 'tune',
      title: 'Kustomisasi Tanpa Coding',
      desc: 'Ubah warna, teks, dan unggah foto produk Anda langsung dari dashboard interaktif. Tidak perlu menyewa programmer atau keahlian IT.'
    },
    {
      icon: 'rocket_launch',
      title: 'Publikasi & Jualan',
      desc: 'Website bisnis Anda siap online dalam hitungan menit dengan dukungan SEO bawaan. Mulai terima pesanan dan kembangkan pelanggan Anda.'
    }
  ];

  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low">
      <div className="max-w-container-max mx-auto text-center">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
          Cara Membuat Website Profesional dalam 3 Langkah
        </h2>
        <p className="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto mb-16">
          Platform pembuat website kami (website builder) memudahkan Anda memiliki toko online atau profil bisnis tanpa menyentuh satu baris kode pun.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-outline-variant/50 z-0"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-6 shadow-lg border-4 border-surface-container-low">
                <span className="material-symbols-outlined text-4xl">{step.icon}</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">{step.title}</h3>
              <p className="font-body-md text-body-md text-secondary">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
