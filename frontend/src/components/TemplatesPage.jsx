import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = 'http://localhost:8000';

const FALLBACK_TEMPLATES = [
  {
    id: 1,
    category: 'Restaurant',
    name: 'The Gourmet',
    price: 49000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSMgjrkP4eKqm_4BrODeI-GJcY7kZ6xB1iPfO80bWXvtz9DMTsRu6pxObWiNqOCFW0CytpDtkDodH4zMXnRhbyzT_e51s21EbxYIrzzXEHKQn1GZXnwUQ4r1wPqZLbLYi2JMbjGjOvgeiX25rFjdMsapV1nkO41cTUT-SWuEpcS9Z2OWSnondYF5u6ZbFAL1BJxh7z_rCi85xF_dzpT2j44gBKZCALryl_6TgLundif7xrXX6hE8TYfOY5KwSFIev52-xRqsAbLb_0',
    description: 'A clean, modern website template design for a high-end restaurant, displayed on a sleek white background.',
    demoUrl: 'http://localhost:5174/templates'
  },
  {
    id: 2,
    category: 'Salon',
    name: 'Style & Glow',
    price: 39000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDui5xDLBlLgvzs_EhjB4krNrP2xVR5KmAzlQwsok8P6PMJlbUE1kyq3osPy8JK6R9c9JUBAX56I5dKdF3REnylCNrPLOCC5U1pnS3SYM3LcZWJf11dBu2MOgkmkBllIZxCs1ke9I7rfZAabD2TOS3T5fduly3erG6gUxwIpJ83J9cHZaR10EP52InUKzLKSR8cinVrCACYpnu-VJLgSttDgiaw83f0pzVv55jw6MnukH2z6sawFByg-4G6PkZcxy1F1NLelUPBib3d',
    description: 'A sophisticated website template layout for a beauty salon, presented on a pristine white surface.',
    demoUrl: 'http://localhost:5174/templates'
  },
  {
    id: 3,
    category: 'Online Store',
    name: 'Urbane Apparel',
    price: 69000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSuI_F2BMoRWzDjldV_PeYz8bZXBFDStgtK2kKDwj3A_Jgsunus_v-I_oOe0hV7l6muiHca97kJ1BThdCRFFVOqjU0IwCRCzg6SNnGrWB5x3BTxDPSyeWRTOr_frrH_nbePI0JiUyILqjmOhzp_-Sawa9EXyj5wEUbWRhfxrZuk-KvMqcnpkdBSVnxOyZRC67DHOaVjwvBadHYOOjUi1rGPAsp1B5Q8X-vKS6ABXINzZDf87J3ifFvVQ1eW-pVnmpryKtdZVosawir',
    description: 'A minimalist online store website template preview, showcasing neatly arranged apparel product grids.',
    demoUrl: 'http://localhost:5174/templates'
  },
  {
    id: 4,
    category: 'Professional Services',
    name: 'Apex Consulting',
    price: 59000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAocVhCFAgGuhC7Z3AkvoZEBzFBM_1dY3B8IFfU0-99wvikJrxurteKUOcxJaCK-ulhF4JJLFx3vtdRGndSzr7E4lvJx3oASOq5OWV9TTT7uJLPY9qyaYdHiBsPI7o8CqzpjTKGVMkyWRQ_lweb-H95RAVqsxlemPOOYT1M8jGgTeZNpTT0bKJK6mKMw2H2Nm8ldQhqH_VxKFBv4s-FNB3egSHHowj4GA9MPZ0LYJ9HGXn2r98cT2wWFf7YPG5xvP1LdMZlajOYxFZ',
    description: 'A professional services website template preview showing a bright, modern corporate office environment.',
    demoUrl: 'http://localhost:5174/templates'
  },
  {
    id: 5,
    category: 'Restaurant',
    name: 'Bistro Brew',
    price: 29000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBowpkrCuUzAvaKvADk0FKB6KkjIk0x_JvjKxqHiFWAeLdPRG0jY_RJrYoL89QMPD_pD-X1bc0kK7GEKBGV77ycSnmVT7qkZfurU9bYeGUElLQW7QmOIeoXEoc3hFnPGgoxikGi5RADZqDqkRBORkUB8RvbybSq4lKUBMLXItDnF66uoR09zDYOdK8gUPEwR-0YZ8o_JPK1jDQJ1MgQBdXozagYfK0pTSquDFghYwqLr-BJR9tBG2sZiuNdon5oW1jeZhWeHoxk_Rp',
    description: 'A vibrant yet structured website template for a modern cafe or bistro, presented in a light-mode UI context.',
    demoUrl: 'http://localhost:5174/templates'
  }
];

const CATEGORIES = ['All Templates', 'Restaurant', 'Salon', 'Online Store', 'Professional Services'];

function TemplatesPage({ onSelectTemplate }) {
  const [selectedCategory, setSelectedCategory] = useState('All Templates');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
    document.title = 'Katalog Desain Website DagangCommerce';
    window.scrollTo(0, 0);

    return () => {
      document.title = 'DagangCommerce | Pembuat Website Toko Online Mudah & Cepat';
    };
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/templates`);
      if (response.data && response.data.data && response.data.data.length > 0) {
        setTemplates(response.data.data);
      } else {
        setTemplates(FALLBACK_TEMPLATES);
      }
    } catch (error) {
      console.error('Failed to fetch public templates:', error);
      setTemplates(FALLBACK_TEMPLATES);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = selectedCategory === 'All Templates'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex-grow flex flex-col gap-4 items-center justify-center min-h-[400px]">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
        <span className="text-secondary text-sm font-semibold">Memuat Desain Kreatif...</span>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-16">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4 tracking-tight text-balance">
          Pilih Desain yang Sesuai dengan Bisnis Anda
        </h1>
        <p className="font-body-md md:font-body-lg text-body-md md:text-body-lg text-secondary">
          Mulai lebih cepat dengan template profesional yang dirancang khusus untuk meningkatkan penjualan dan membangun kredibilitas merek Anda.
        </p>
      </section>

      {/* Filter Section */}
      <section className="mb-10 md:mb-12 overflow-hidden">
        <div className="flex overflow-x-auto no-scrollbar gap-3 md:justify-center pb-3 px-margin-mobile md:px-0 -mx-margin-mobile md:mx-0">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full font-label-md text-label-md transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-primary text-on-primary shadow-md border border-transparent'
                  : 'bg-surface-container-lowest border border-outline-variant text-secondary hover:border-primary hover:text-primary bg-transparent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Templates Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-gutter min-h-[400px]">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="group w-full max-w-[440px] mx-auto md:max-w-none bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-surface-variant overflow-hidden flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
          >
            {/* Image Preview Container */}
            <div className="w-full aspect-[4/3] bg-surface-container relative overflow-hidden flex items-center justify-center">
              {template.image ? (
                <img
                  alt={template.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  src={template.image}
                  title={template.description || template.name}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-surface-variant to-surface-container-high flex items-center justify-center p-4">
                  <div className="w-3/4 h-3/4 bg-surface-container-lowest rounded-lg shadow-sm flex flex-col p-4 opacity-90 group-hover:scale-105 transition-transform duration-500">
                    <div className="w-full h-8 bg-primary-container rounded mb-3"></div>
                    <div className="w-2/3 h-4 bg-surface-variant rounded mb-2"></div>
                    <div className="w-1/2 h-4 bg-surface-variant rounded mb-6"></div>
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      <div className="h-16 bg-surface-container rounded"></div>
                      <div className="h-16 bg-surface-container rounded"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Template Information Card */}
            <div className="p-6 flex flex-col flex-grow text-left">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-surface text-secondary font-label-sm text-label-sm uppercase tracking-wider">
                    {template.category}
                  </span>
                  <span className="font-bold text-primary font-label-md text-label-md">
                    Rp {template.price.toLocaleString('id-ID')}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  {template.name}
                </h3>
                {template.description && (
                  <p className="text-secondary text-xs mt-2 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                )}
              </div>
              
              <div className="mt-auto flex gap-3 pt-4 border-t border-surface-variant">
                {template.demoUrl ? (
                  <a 
                    href={template.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface transition-colors flex justify-center items-center gap-2 cursor-pointer bg-transparent text-center"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    Preview
                  </a>
                ) : (
                  <button 
                    onClick={() => alert(`Previewing ${template.name} template...`)}
                    className="flex-1 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface transition-colors flex justify-center items-center gap-2 cursor-pointer bg-transparent"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    Preview
                  </button>
                )}
                <button
                  onClick={() => onSelectTemplate(template.name)}
                  className="flex-1 py-2.5 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md hover:brightness-95 transition-all active:scale-95 border border-none cursor-pointer"
                >
                  Pilih
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default TemplatesPage;
