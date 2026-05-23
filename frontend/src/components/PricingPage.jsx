import React, { useState } from 'react';

const FAQ_DATA = [
  {
    question: 'Apakah saya bisa upgrade atau downgrade paket kapan saja?',
    answer: 'Ya, Anda dapat mengubah paket berlangganan Anda kapan saja melalui dashboard pengaturan akun. Perubahan akan berlaku pada siklus tagihan berikutnya.'
  },
  {
    question: 'Apakah ada biaya tambahan per transaksi?',
    answer: 'DagangMaker tidak memungut biaya tambahan per transaksi. Namun, biaya standar dari payment gateway (seperti Midtrans atau Xendit) mungkin berlaku tergantung metode pembayaran yang dipilih pelanggan Anda.'
  }
];

function PricingPage({ onSelectPlan }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-container-padding-mobile md:px-container-padding-desktop py-12">
      {/* Header Section */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-4">
          Paket Hemat untuk Bisnis Hebat
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Pilih paket yang paling sesuai dengan tahap pertumbuhan bisnis Anda. Tidak ada biaya tersembunyi, batalkan kapan saja.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-16 items-stretch">
        {/* Starter Card */}
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-surface-container-highest flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 text-left">Starter</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6 h-12 text-left">
            Fitur dasar untuk pehobi dan bisnis yang baru memulai.
          </p>
          <div className="mb-8 text-left">
            <span className="font-headline-lg text-headline-lg text-on-background">Rp 0</span>
            <span className="font-body-md text-body-md text-on-surface-variant">/bulan</span>
          </div>
          <button
            onClick={() => onSelectPlan('Starter')}
            className="w-full py-3 px-4 rounded-lg font-label-md text-label-md border border-outline text-on-surface hover:bg-surface-container transition-colors mb-8 cursor-pointer bg-transparent"
          >
            Mulai Gratis
          </button>
          <div className="flex-grow">
            <ul className="space-y-4 font-body-md text-body-md text-on-surface text-left">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                Subdomain DagangMaker
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                Maksimal 50 Produk
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                Template Dasar
              </li>
            </ul>
          </div>
        </div>

        {/* Pro Card (Recommended) */}
        <div className="bg-surface-container-lowest rounded-xl p-8 border-2 border-primary flex flex-col relative hover:-translate-y-2 hover:shadow-xl transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)] md:-translate-y-2">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-container text-on-primary-container font-label-sm text-label-sm py-1 px-4 rounded-full uppercase tracking-wider font-bold shadow-[0_0_15px_rgba(250,204,21,0.5)]">
            Direkomendasikan
          </div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 text-left">Pro</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6 h-12 text-left">
            Fitur profesional, custom domain, bebas iklan untuk bisnis serius.
          </p>
          <div className="mb-8 text-left">
            <span className="font-headline-lg text-headline-lg text-on-background">Rp 99.000</span>
            <span className="font-body-md text-body-md text-on-surface-variant">/bulan</span>
          </div>
          <button
            onClick={() => onSelectPlan('Pro')}
            className="w-full py-3 px-4 rounded-lg font-label-md text-label-md bg-primary-container text-on-primary-container hover:brightness-95 transition-all mb-8 shadow-sm border border-none cursor-pointer"
          >
            Pilih Pro
          </button>
          <div className="flex-grow">
            <ul className="space-y-4 font-body-md text-body-md text-on-surface text-left">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                Custom Domain Sendiri
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                Produk Tanpa Batas
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                Semua Template Premium
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                Tanpa Iklan DagangMaker
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                Integrasi Pembayaran
              </li>
            </ul>
          </div>
        </div>

        {/* Enterprise Card */}
        <div className="bg-surface-container-lowest rounded-xl p-8 border border-surface-container-highest flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 text-left">Enterprise</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6 h-12 text-left">
            Fitur canggih untuk bisnis yang berkembang pesat.
          </p>
          <div className="mb-8 text-left">
            <span className="font-headline-lg text-headline-lg text-on-background">Rp 299.000</span>
            <span className="font-body-md text-body-md text-on-surface-variant">/bulan</span>
          </div>
          <button
            onClick={() => onSelectPlan('Enterprise')}
            className="w-full py-3 px-4 rounded-lg font-label-md text-label-md border border-outline text-on-surface hover:bg-surface-container transition-colors mb-8 cursor-pointer bg-transparent"
          >
            Pilih Enterprise
          </button>
          <div className="flex-grow">
            <ul className="space-y-4 font-body-md text-body-md text-on-surface text-left">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                Semua Fitur Pro
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                Prioritas Dukungan 24/7
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                Manajemen Multi-Toko
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                Laporan Analitik Mendalam
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="font-headline-md text-headline-md text-on-background">Bandingkan Fitur Secara Lengkap</h2>
        </div>
        <div className="w-full overflow-x-auto rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-surface-container-highest">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-container-highest">
                <th className="p-6 font-headline-sm text-headline-sm text-on-surface w-2/5">Fitur</th>
                <th className="p-6 font-headline-sm text-headline-sm text-on-surface text-center w-1/5">Starter</th>
                <th className="p-6 font-headline-sm text-headline-sm text-on-surface text-center w-1/5 bg-primary-container/10">Pro</th>
                <th className="p-6 font-headline-sm text-headline-sm text-on-surface text-center w-1/5">Enterprise</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md text-on-surface-variant">
              <tr className="border-b border-surface-container-highest hover:bg-surface transition-colors">
                <td className="p-4 pl-6 text-on-surface font-semibold text-left">Batas Produk</td>
                <td className="p-4 text-center">50</td>
                <td className="p-4 text-center bg-primary-container/5 font-bold text-on-surface">Unlimited</td>
                <td className="p-4 text-center">Unlimited</td>
              </tr>
              <tr className="border-b border-surface-container-highest hover:bg-surface transition-colors">
                <td className="p-4 pl-6 text-on-surface font-semibold text-left">Domain Custom</td>
                <td className="p-4 text-center">
                  <span className="material-symbols-outlined text-tertiary">close</span>
                </td>
                <td className="p-4 text-center bg-primary-container/5">
                  <span className="material-symbols-outlined text-primary">check</span>
                </td>
                <td className="p-4 text-center">
                  <span className="material-symbols-outlined text-primary">check</span>
                </td>
              </tr>
              <tr className="border-b border-surface-container-highest hover:bg-surface transition-colors">
                <td className="p-4 pl-6 text-on-surface font-semibold text-left">Bebas Iklan</td>
                <td className="p-4 text-center">
                  <span className="material-symbols-outlined text-tertiary">close</span>
                </td>
                <td className="p-4 text-center bg-primary-container/5">
                  <span className="material-symbols-outlined text-primary">check</span>
                </td>
                <td className="p-4 text-center">
                  <span className="material-symbols-outlined text-primary">check</span>
                </td>
              </tr>
              <tr className="border-b border-surface-container-highest hover:bg-surface transition-colors">
                <td className="p-4 pl-6 text-on-surface font-semibold text-left">Dukungan</td>
                <td className="p-4 text-center">Komunitas</td>
                <td className="p-4 text-center bg-primary-container/5">Email</td>
                <td className="p-4 text-center">24/7 Prioritas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-headline-md text-headline-md text-on-background mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
        </div>
        <div className="space-y-4">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                onClick={() => toggleFaq(index)}
                className="bg-surface-container-lowest rounded-lg p-6 border border-surface-container-highest cursor-pointer hover:shadow-sm transition-all text-left"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-label-md text-label-md text-on-surface text-lg font-semibold">
                    {faq.question}
                  </h4>
                  <span className="material-symbols-outlined text-secondary transition-transform duration-300">
                    {isOpen ? 'remove' : 'add'}
                  </span>
                </div>
                <div 
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default PricingPage;
