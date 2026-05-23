import React from 'react';
import { useNavigate } from 'react-router-dom';
import CardSwap, { Card } from './CardSwap';

function Hero({ onCtaClick }) {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[819px] flex items-center py-16 px-margin-mobile md:px-margin-desktop hero-gradient overflow-hidden">
        <div className="max-w-container-max mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
            <div className="z-10 text-center md:text-left order-2 md:order-1">
                <h1 className="font-display-lg text-display-lg text-on-surface mb-6 leading-tight">
                    Bangun Website Profesional <span className="text-primary">Secara Instan</span>
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl">
                    Pilih dari puluhan layout siap pakai untuk salon, resto, atau toko online Anda. Ubah warna dan gaya hanya dengan satu klik.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <button onClick={onCtaClick} className="bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded-xl shadow-lg hover:shadow-primary/20 transition-all border-none cursor-pointer">
                        Mulai Gratis
                    </button>
                </div>
            </div>
            
            {/* 🎴 CardSwap Container */}
            <div className="relative flex justify-center items-center min-h-[500px] w-full order-1 md:order-2">
                <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                
                <div className="scale-[0.8] sm:scale-100 origin-center" style={{ height: '400px', width: '340px', position: 'relative', overflow: 'visible' }}>
                  <CardSwap
                    width={340}
                    height={400}
                    cardDistance={45}
                    verticalDistance={50}
                    delay={3500}
                    pauseOnHover={true}
                    skewAmount={4}
                    onCardClick={() => navigate('/templates')}
                  >
                    {/* Restaurant Website Mockup */}
                    <Card className="shadow-2xl overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white text-slate-800 text-left flex flex-col justify-between">
                      {/* Browser top bar */}
                      <div className="bg-slate-50 px-4 py-3 flex items-center gap-2 border-b border-slate-100 rounded-t-[2rem]">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex-grow mx-2 bg-slate-200/50 rounded-md py-0.5 text-center text-[10px] text-slate-500 font-mono select-none truncate">
                          thegourmet.id
                        </div>
                      </div>

                      {/* Website content */}
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          {/* Mini Nav */}
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[11px] font-bold text-amber-900">THE GOURMET</span>
                            <span className="bg-amber-100 text-amber-900 text-[9px] px-2 py-0.5 rounded-full font-bold">Resto</span>
                          </div>
                          
                          {/* Banner Image */}
                          <div className="relative rounded-xl overflow-hidden mb-3 shadow-sm border border-slate-100 h-[140px]">
                            <img 
                              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2340&auto=format&fit=crop" 
                              className="w-full h-full object-cover" 
                              alt="Restaurant Website" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2.5">
                              <span className="text-white text-[10px] font-semibold tracking-wide uppercase">Citarasa Autentik</span>
                            </div>
                          </div>
                          
                          <h3 className="font-serif text-base font-semibold text-slate-800 leading-snug">
                            Hidangan Mewah Klasik & Modern
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                            Pesan meja Anda sekarang dan rasakan mahakarya kuliner terbaik karya chef berpengalaman kami.
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                          <span className="text-xs font-bold text-amber-900">Buka 10:00 - 22:00</span>
                          <button className="bg-amber-950 text-white text-[11px] px-3.5 py-1.5 rounded-lg font-bold border-none cursor-pointer hover:bg-amber-900 transition-colors">
                            Reservasi
                          </button>
                        </div>
                      </div>
                    </Card>

                    {/* Salon Website Mockup */}
                    <Card className="shadow-2xl overflow-hidden rounded-[2rem] border border-pink-100/30 bg-slate-900 text-white text-left flex flex-col justify-between">
                      {/* Browser top bar */}
                      <div className="bg-slate-800/80 px-4 py-3 flex items-center gap-2 border-b border-slate-800/50 rounded-t-[2rem]">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex-grow mx-2 bg-slate-950/40 rounded-md py-0.5 text-center text-[10px] text-slate-400 font-mono select-none truncate">
                          styleandglow.id
                        </div>
                      </div>

                      {/* Website content */}
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          {/* Mini Nav */}
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[11px] font-bold text-pink-400 tracking-wider">STYLE & GLOW</span>
                            <span className="bg-pink-400/20 text-pink-300 text-[9px] px-2 py-0.5 rounded-full font-bold">Salon</span>
                          </div>
                          
                          {/* Banner Image */}
                          <div className="relative rounded-xl overflow-hidden mb-3 shadow-sm border border-slate-800 h-[140px]">
                            <img 
                              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2274&auto=format&fit=crop" 
                              className="w-full h-full object-cover" 
                              alt="Salon Website" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent flex items-end p-2.5">
                              <span className="text-white text-[10px] font-semibold tracking-wide uppercase">Tampil Elegan</span>
                            </div>
                          </div>
                          
                          <h3 className="font-sans text-base font-bold text-slate-100 leading-snug">
                            Layanan Hair Styling & Perawatan Premium
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                            Pilihan warna rambut, cutting model terkini, dan perawatan kecantikan menyeluruh oleh ahlinya.
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-800">
                          <span className="text-xs font-bold text-pink-300">Stylist Tersertifikasi</span>
                          <button className="bg-pink-500 text-white text-[11px] px-3.5 py-1.5 rounded-lg font-bold border-none cursor-pointer hover:bg-pink-600 transition-colors">
                            Booking
                          </button>
                        </div>
                      </div>
                    </Card>

                    {/* E-Commerce Website Mockup */}
                    <Card className="shadow-2xl overflow-hidden rounded-[2rem] border border-indigo-100 bg-white text-slate-800 text-left flex flex-col justify-between">
                      {/* Browser top bar */}
                      <div className="bg-indigo-50/50 px-4 py-3 flex items-center gap-2 border-b border-indigo-50 rounded-t-[2rem]">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                        </div>
                        <div className="flex-grow mx-2 bg-slate-200/50 rounded-md py-0.5 text-center text-[10px] text-indigo-900/60 font-mono select-none truncate">
                          urbaneapparel.store
                        </div>
                      </div>

                      {/* Website content */}
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          {/* Mini Nav */}
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[11px] font-bold text-indigo-900 tracking-wider">URBANE APPAREL</span>
                            <span className="bg-indigo-100 text-indigo-900 text-[9px] px-2 py-0.5 rounded-full font-bold">Toko Online</span>
                          </div>
                          
                          {/* Banner Image */}
                          <div className="relative rounded-xl overflow-hidden mb-3 shadow-sm border border-slate-100 h-[140px]">
                            <img 
                              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2340&auto=format&fit=crop" 
                              className="w-full h-full object-cover" 
                              alt="Store Website" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/50 to-transparent flex items-end p-2.5">
                              <span className="text-white text-[10px] font-semibold tracking-wide uppercase">New Arrivals 2026</span>
                            </div>
                          </div>
                          
                          <h3 className="font-sans text-base font-semibold text-slate-800 leading-snug">
                            Koleksi Pakaian Urban Minimalis
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                            Dapatkan produk fashion terbaik dengan penawaran eksklusif dan gratis ongkir ke seluruh Indonesia.
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                          <span className="text-xs font-bold text-indigo-600">Diskon Hingga 50%</span>
                          <button className="bg-indigo-600 text-white text-[11px] px-3.5 py-1.5 rounded-lg font-bold border-none cursor-pointer hover:bg-indigo-700 transition-colors">
                            Belanja
                          </button>
                        </div>
                      </div>
                    </Card>
                  </CardSwap>
                </div>
            </div>
        </div>
    </section>
  );
}

export default Hero;
