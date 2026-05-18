import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah',
    memberSince: '2023',
    quote: 'Awalnya ragu ke gym karena takut dilihat cowok. Di sini nyaman banget! Apalagi ada kelas Zumba tiap sore, pas pulang kerja langsung olahraga.',
    rating: 5,
    category: 'Penurunan Berat'
  },
  {
    id: 2,
    name: 'Nisa',
    memberSince: '2022',
    quote: 'Trainer-nya super sabar ngajarin form yang bener buat pemula kayak aku. Alhamdulillah udah turun 8kg dalam 4 bulan tanpa ngerasa tersiksa.',
    rating: 5,
    category: 'Pembentukan'
  },
  {
    id: 3,
    name: 'Amalia',
    memberSince: '2024',
    quote: 'Fasilitas saunanya the best! Alat-alat juga lengkap dan bersih. Nggak nyesel ambil langganan tahunan langsung.',
    rating: 5,
    category: 'Kebugaran'
  }
];

export default function TestimonialStrip() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const next = () => setActiveIndex((current) => (current + 1) % testimonials.length);
  const prev = () => setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="section-padding bg-brand-dark text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-3xl"></div>
      
      <div className="container-brand relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold text-brand-primary-light tracking-wider uppercase mb-2">Kata Mereka</h2>
          <h3 className="text-3xl md:text-4xl font-display font-bold text-white">Review Member Asli</h3>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out-brand"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div key={t.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center relative backdrop-blur-sm">
                    <Quote className="absolute top-6 left-6 md:top-8 md:left-8 text-white/10" size={64} />
                    
                    <div className="flex justify-center mb-6">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="text-[#FFB800] fill-[#FFB800] w-5 h-5 mx-0.5" />
                      ))}
                    </div>
                    
                    <p className="text-lg md:text-2xl font-display italic text-white/90 mb-8 max-w-2xl mx-auto relative z-10 leading-relaxed">
                      "{t.quote}"
                    </p>
                    
                    <div>
                      <div className="font-bold text-brand-primary-light">{t.name}</div>
                      <div className="text-sm text-white/50">Member sejak {t.memberSince} • {t.category}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center mt-8 gap-4">
            <button onClick={prev} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-dark transition-colors" aria-label="Review sebelumnya">
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'w-8 bg-brand-primary-light' : 'bg-white/30'}`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>
            <button onClick={next} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-brand-dark transition-colors" aria-label="Review selanjutnya">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
