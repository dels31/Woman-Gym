import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { GYM_NAME, WA_LINK } from '../../lib/constants';

const navLinks = [
  { name: 'Beranda', href: '/' },
  { name: 'Program', href: '/program' },
  { name: 'Fasilitas', href: '/fasilitas' },
  { name: 'Harga', href: '/harga' },
  { name: 'Testimoni', href: '/testimoni' },
  { name: 'Kontak', href: '/kontak' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-brand-sm' : 'bg-transparent'}`}>
      <div className="container-brand mx-auto px-4 h-20 flex items-center justify-between">
        <a href="/" className="text-2xl font-display font-bold text-brand-primary">
          {GYM_NAME}
        </a>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-brand-dark hover:text-brand-primary font-medium transition-colors">
              {link.name}
            </a>
          ))}
          <a href="/daftar" className="bg-brand-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-brand-primary-light transition-colors shadow-brand-md">
            Daftar Sekarang
          </a>
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-brand-dark p-2" aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`md:hidden absolute top-20 left-0 w-full bg-white shadow-brand-lg transition-all duration-300 ease-in-out-brand ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="flex flex-col p-4 space-y-4">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-brand-dark hover:text-brand-primary font-medium p-2 block" onClick={() => setIsOpen(false)}>
              {link.name}
            </a>
          ))}
          <a href="/daftar" className="bg-brand-primary text-center text-white px-6 py-3 rounded-md font-medium hover:bg-brand-primary-light transition-colors" onClick={() => setIsOpen(false)}>
            Daftar Sekarang
          </a>
        </div>
      </div>
    </nav>
  );
}
