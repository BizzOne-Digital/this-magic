import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import Button from './Button';
import { getLogoUrl, LOGO_PATH } from '../constants/site';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Testimonials', path: '/testimonials' },
  { name: 'Contact', path: '/contact' },
];

const Header = ({ logoUrl, transparent = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoSrc, setLogoSrc] = useState(getLogoUrl(logoUrl));
  const location = useLocation();

  useEffect(() => {
    setLogoSrc(getLogoUrl(logoUrl));
  }, [logoUrl]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !transparent ? 'bg-navy/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container-custom mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          <Link to="/" className="flex items-center group shrink-0">
            <img
              src={logoSrc}
              alt="This Magic Moment — DJ Adam"
              className="h-14 sm:h-16 md:h-[4.5rem] w-auto max-w-[200px] sm:max-w-[240px] md:max-w-[280px] object-contain"
              onError={() => setLogoSrc(LOGO_PATH)}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold uppercase tracking-wider transition-colors ${
                  isActive(link.path) ? 'text-teal' : 'text-white hover:text-teal'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button to="/contact" variant="primary" className="!px-6 !py-2.5 !text-sm">
              Let&apos;s Talk
            </Button>
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white text-2xl p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-navy/98 backdrop-blur-md border-t border-white/10">
          <nav className="container-custom mx-auto px-4 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-lg font-semibold uppercase tracking-wider py-2 ${
                  isActive(link.path) ? 'text-teal' : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Button to="/contact" variant="primary" className="mt-4 justify-center">
              Let&apos;s Talk
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
