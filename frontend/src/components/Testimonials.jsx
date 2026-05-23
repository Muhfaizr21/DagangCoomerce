import React from 'react';

function Testimonials() {
  const reviews = [
    {
      name: 'Budi Santoso',
      role: 'Pemilik Kedai Kopi',
      content: 'Berkat DagangMaker, saya bisa membuat website restoran sendiri tanpa mengerti coding. Penjualan online kopi saya naik drastis karena pelanggan mudah melihat menu dan memesan!',
      rating: 5
    },
    {
      name: 'Siti Aminah',
      role: 'Owner Butik Fashion',
      content: 'Platform toko online terbaik untuk UMKM. Template bajunya sangat elegan, sistemnya responsif di HP, dan fitur SEO-nya membuat toko saya sering muncul di halaman pertama Google.',
      rating: 5
    },
    {
      name: 'Andi Wijaya',
      role: 'Konsultan Bisnis',
      content: 'Proses bikin website company profile yang dulunya makan waktu berminggu-minggu dan mahal, sekarang hanya hitungan menit. Desainnya sangat premium dan profesional.',
      rating: 5
    }
  ];

  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest border-y border-outline-variant/30">
      <div className="max-w-container-max mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
            Kisah Sukses Ribuan Bisnis Bersama Kami
          </h2>
          <p className="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto">
            Baca ulasan nyata dari para pengusaha dan pemilik UMKM yang telah berhasil mentransformasi bisnis mereka ke dunia digital.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div key={i} className="bg-surface-container rounded-2xl p-8 border border-outline-variant/50 hover:shadow-lg transition-all flex flex-col">
              <div className="flex gap-1 text-primary mb-6">
                {[...Array(review.rating)].map((_, idx) => (
                  <span key={idx} className="material-symbols-outlined fill-current" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                ))}
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant italic mb-8 flex-grow">
                "{review.content}"
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-xl">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface">{review.name}</h4>
                  <p className="text-sm text-secondary">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
