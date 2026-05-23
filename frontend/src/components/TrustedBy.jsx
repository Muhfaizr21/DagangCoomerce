import React from 'react';

function TrustedBy() {
  return (
    <section className="py-12 border-y border-outline-variant/30 bg-surface">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
        <p className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-8">
          Dipercaya oleh 10.000+ UMKM, Restoran, dan Toko Online di Seluruh Indonesia
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale">
            <div className="flex items-center gap-2 font-headline-sm text-on-surface font-bold"><span className="material-symbols-outlined text-3xl">restaurant</span> RasaLokal</div>
            <div className="flex items-center gap-2 font-headline-sm text-on-surface font-bold"><span className="material-symbols-outlined text-3xl">shopping_bag</span> TokoKini</div>
            <div className="flex items-center gap-2 font-headline-sm text-on-surface font-bold"><span className="material-symbols-outlined text-3xl">content_cut</span> SalonGaya</div>
            <div className="flex items-center gap-2 font-headline-sm text-on-surface font-bold"><span className="material-symbols-outlined text-3xl">local_cafe</span> KopiSenja</div>
            <div className="flex items-center gap-2 font-headline-sm text-on-surface font-bold"><span className="material-symbols-outlined text-3xl">storefront</span> MitraMart</div>
        </div>
      </div>
    </section>
  );
}

export default TrustedBy;
