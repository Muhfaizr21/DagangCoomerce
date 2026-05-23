import React from 'react';

function Features() {
  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface" id="features">
        <div className="max-w-container-max mx-auto">
            <div className="text-center mb-16">
                <h2 className="font-headline-lg text-headline-lg mb-4">Mengapa Memilih DagangMaker?</h2>
                <div className="h-1.5 w-24 bg-primary mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-gutter">
                {/* Card 1 */}
                <div className="group p-8 rounded-2xl bg-white border border-outline-variant hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                    <div className="w-14 h-14 bg-primary-container/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-3xl">auto_awesome_motion</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md mb-3">Siap Pakai</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Puluhan template profesional untuk berbagai kategori bisnis. Tinggal pilih dan sesuaikan konten Anda.
                    </p>
                </div>
                {/* Card 2 */}
                <div className="group p-8 rounded-2xl bg-white border border-outline-variant hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                    <div className="w-14 h-14 bg-secondary-container/20 rounded-xl flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-3xl">tune</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md mb-3">Kustomisasi Penuh</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Ganti warna, font, dan layout tanpa coding. Antarmuka yang intuitif memudahkan siapa saja menjadi desainer.
                    </p>
                </div>
                {/* Card 3 */}
                <div className="group p-8 rounded-2xl bg-white border border-outline-variant hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                    <div className="w-14 h-14 bg-tertiary-fixed rounded-xl flex items-center justify-center text-tertiary mb-6 group-hover:bg-tertiary group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-3xl">devices</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md mb-3">Mobile Ready</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Website Anda terlihat sempurna di HP, tablet, dan laptop secara otomatis tanpa perlu pengaturan tambahan.
                    </p>
                </div>
            </div>
        </div>
    </section>
  );
}

export default Features;
