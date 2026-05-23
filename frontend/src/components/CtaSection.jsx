import React from 'react';

function CtaSection({ onCtaClick }) {
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 backdrop-blur-sm"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10 bg-surface-container-lowest/90 backdrop-blur-xl p-8 md:p-16 rounded-3xl border border-white/60 shadow-2xl">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">
          Siap Membawa Bisnis Anda ke Level Berikutnya?
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
          Tinggalkan cara lama. Bergabunglah dengan puluhan ribu UMKM yang telah berhasil membangun toko online dan website profesional dalam hitungan menit bersama DagangMaker.
        </p>
        <button 
          onClick={onCtaClick} 
          className="bg-primary text-on-primary font-label-md text-label-md px-10 py-5 rounded-xl shadow-[0_10px_40px_rgba(115,92,0,0.3)] hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(115,92,0,0.4)] transition-all border-none cursor-pointer text-lg"
        >
          Buat Website Gratis Sekarang
        </button>
        <p className="mt-6 text-sm text-secondary font-medium">
          *Mulai 100% gratis. Tidak perlu memasukkan kartu kredit.
        </p>
      </div>
    </section>
  );
}

export default CtaSection;
