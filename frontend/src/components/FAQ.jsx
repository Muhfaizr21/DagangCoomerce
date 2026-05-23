import React, { useState } from 'react';

function FAQ() {
  const faqs = [
    {
      q: 'Apakah saya membutuhkan keahlian coding untuk membuat website di DagangMaker?',
      a: 'Sama sekali tidak! DagangMaker adalah platform pembuat website tanpa coding (no-code). Cukup pilih template, ubah teks, gambar, dan warna sesuai merek Anda, lalu website siap diluncurkan dalam hitungan menit.'
    },
    {
      q: 'Apakah website saya akan responsif dan bisa dibuka di HP?',
      a: 'Tentu saja. Semua desain template website toko online, restoran, maupun portofolio kami sudah 100% mobile-friendly. Tampilan website Anda akan beradaptasi secara otomatis agar sempurna di smartphone, tablet, maupun komputer.'
    },
    {
      q: 'Bagaimana cara website saya bisa muncul di pencarian Google (SEO)?',
      a: 'Platform kami dilengkapi dengan struktur kode yang sangat ramah SEO (Search Engine Optimization). Template kami dirancang untuk memiliki kecepatan muat (loading) yang tinggi, tag HTML semantik, dan fitur meta-tag otomatis yang mendongkrak peringkat Anda di mesin pencari.'
    },
    {
      q: 'Apakah tersedia fitur keranjang belanja untuk toko online e-commerce?',
      a: 'Ya! Untuk paket e-commerce, kami menyediakan fitur keranjang belanja pintar, manajemen katalog produk, hingga integrasi inventaris sehingga Anda bisa langsung berjualan online secara profesional layaknya marketplace besar.'
    }
  ];

  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
            Pertanyaan Seputar Pembuatan Website
          </h2>
          <p className="font-body-lg text-body-lg text-secondary">
            Temukan jawaban untuk membantu Anda memulai digitalisasi bisnis tanpa keraguan.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`border border-outline-variant/50 rounded-2xl overflow-hidden bg-surface-container-lowest transition-all duration-300 ${openIdx === idx ? 'shadow-md border-primary/30' : 'hover:bg-surface-container'}`}
            >
              <button 
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                className="w-full text-left p-6 flex justify-between items-center bg-transparent border-none cursor-pointer"
              >
                <h3 className="font-headline-sm text-headline-sm text-on-surface pr-8">{faq.q}</h3>
                <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIdx === idx ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
