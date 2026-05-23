import React, { useState } from 'react';

function LayoutComparison() {
  const [activeLayout, setActiveLayout] = useState('minimalist');
  const [transitioning, setTransitioning] = useState(false);

  const layouts = {
    minimalist: {
      content: (
        <div className="layout-content grid grid-cols-1 md:grid-cols-2 h-full">
            <div className="flex flex-col justify-center text-left p-6 md:p-12 bg-white">
                <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4">COFFEE & CO.</span>
                <h1 className="text-2xl md:text-4xl font-light mb-4 md:mb-6">Simple Beans, Better Mornings.</h1>
                <p className="text-gray-500 mb-6 md:mb-8 text-sm md:text-base">Elevating your daily coffee ritual through simplicity and quality sourcing.</p>
                <button className="w-fit border-b border-black pb-1 font-bold bg-transparent cursor-pointer">Shop Now</button>
            </div>
            <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2340&auto=format&fit=crop" alt="Coffee" className="w-full h-48 md:h-full object-cover" />
        </div>
      )
    },
    bold: {
      content: (
        <div className="layout-content flex flex-col justify-center items-center text-center p-6 md:p-12 bg-slate-900 text-white h-full relative overflow-hidden">
            <div className="absolute inset-0 opacity-40">
                <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=2487&auto=format&fit=crop" className="w-full h-full object-cover" alt="Coffee beans" />
            </div>
            <div className="relative z-10">
                <h1 className="text-3xl md:text-6xl font-black italic tracking-tighter mb-4 uppercase">WAKE THE HELL UP.</h1>
                <p className="text-sm md:text-xl mb-6 md:mb-8 max-w-md mx-auto opacity-80">Premium coffee for those who don't stop. Double shot, zero excuses.</p>
                <button className="bg-yellow-400 text-black px-6 md:px-10 py-3 md:py-4 font-black rounded-none skew-x-[-10deg] hover:scale-105 transition-transform border-none cursor-pointer">ORDER NOW</button>
            </div>
        </div>
      )
    },
    classic: {
      content: (
        <div className="layout-content flex flex-col h-full bg-stone-50">
            <div className="h-14 md:h-16 border-b border-stone-200 flex items-center justify-center font-serif text-xl md:text-2xl italic">The Coffee Estate</div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 p-6 md:p-12 items-center">
                <div className="text-left font-serif">
                    <h1 className="text-2xl md:text-5xl mb-4 md:mb-6">A Tradition of Fine Brewing.</h1>
                    <p className="text-stone-600 italic text-sm md:text-base mb-6 md:mb-8">Established 1924. Sourcing the finest Arabica beans from high-altitude estates across Indonesia.</p>
                    <button className="px-6 py-2.5 border border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-white transition-all bg-transparent cursor-pointer">Book a Tasting</button>
                </div>
                <div className="relative h-40 md:h-96">
                    <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=2261&auto=format&fit=crop" className="w-full h-full object-cover rounded-sm shadow-xl" alt="Vintage coffee" />
                </div>
            </div>
        </div>
      )
    }
  };

  const switchLayout = (type) => {
    if (type === activeLayout) return;
    setTransitioning(true);
    setTimeout(() => {
      setActiveLayout(type);
      setTransitioning(false);
    }, 300);
  };

  return (
    <section className="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-low overflow-hidden" id="templates">
        <div className="max-w-container-max mx-auto text-center relative">
            <h2 className="font-headline-lg text-headline-lg mb-4">Satu Bisnis, Banyak Pilihan Gaya</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">Lihat bagaimana bisnis yang sama bisa memiliki aura yang berbeda hanya dengan satu kali klik</p>
            
            {/* Premium Segmented Control Tabs */}
            <div className="flex flex-wrap justify-center mb-16 relative z-10">
                <div className="inline-flex flex-wrap justify-center bg-surface-container-lowest p-1.5 rounded-full border border-surface-variant shadow-sm relative">
                    {[
                      { id: 'minimalist', label: 'Minimalist' },
                      { id: 'bold', label: 'Bold & Modern' },
                      { id: 'classic', label: 'Classic & Elegant' }
                    ].map((type) => (
                        <button
                            key={type.id}
                            className={`relative z-10 font-label-md text-label-md px-6 md:px-8 py-2.5 rounded-full transition-colors duration-300 cursor-pointer border-none ${
                                activeLayout === type.id 
                                    ? 'text-on-primary' 
                                    : 'text-secondary hover:text-on-surface bg-transparent'
                            }`}
                            onClick={() => switchLayout(type.id)}
                        >
                            {activeLayout === type.id && (
                                <div className="absolute inset-0 bg-primary rounded-full -z-10 shadow-md"></div>
                            )}
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Browser Mockup Window */}
            <div className="relative max-w-5xl mx-auto">
                {/* Ambient Glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/40 via-inverse-primary/30 to-primary/40 rounded-[2.5rem] blur-2xl opacity-60"></div>
                
                {/* Browser Frame */}
                <div className="relative overflow-hidden rounded-2xl md:rounded-3xl min-h-[550px] md:min-h-0 md:aspect-[16/9] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] bg-white border border-surface-variant flex flex-col">
                    {/* Browser Top Bar */}
                    <div className="h-10 bg-surface-container-lowest border-b border-surface-variant flex items-center px-4 gap-2 shrink-0">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        <div className="flex-grow flex justify-center">
                            <div className="bg-surface-container px-6 py-1 rounded-md text-[10px] font-mono text-secondary w-48 text-center truncate">
                                mybusiness.dagangmaker.com
                            </div>
                        </div>
                        <div className="w-10"></div> {/* Spacer for symmetry */}
                    </div>
                    
                    {/* Browser Content Viewport */}
                    <div className={`w-full flex-grow flex flex-col transition-all duration-500 transform ${transitioning ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'}`} id="layout-display">
                        {layouts[activeLayout].content}
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}

export default LayoutComparison;
