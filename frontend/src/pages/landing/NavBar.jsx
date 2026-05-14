import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import Logo from './Logo';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navBg = scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent';
  const textColor   = scrolled ? 'var(--color-text)'        : 'rgba(255,255,255,0.9)';
  const borderColor = scrolled ? 'var(--color-border)'      : 'rgba(255,255,255,0.2)';

  return (
    <header
      data-scrolled={String(scrolled)}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      style={{ height: 'var(--nav-top-h)' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        <Logo variant={scrolled ? 'light' : 'dark'} />

        <nav className="hidden md:flex items-center gap-1">
          {['Features', 'How it works', 'Doctors', 'FAQ'].map(label => (
            <a key={label} href={`#${label.toLowerCase().replace(/ /g, '-')}`}
               className="nav-link" style={{ color: textColor }}>
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login"
                className="text-sm font-semibold px-4 rounded-lg flex items-center"
                style={{ height: 'var(--btn-h-sm)', color: scrolled ? 'var(--color-text)' : '#fff',
                         border: `1.5px solid ${borderColor}` }}>
            Sign in
          </Link>
          <Link to="/register"
                className="text-sm font-semibold px-4 rounded-lg flex items-center"
                style={{ height: 'var(--btn-h-sm)',
                         backgroundColor: scrolled ? 'var(--color-primary-600)' : '#fff',
                         color: scrolled ? '#fff' : 'var(--color-primary-800)' }}>
            Get started
          </Link>
        </div>

        <button className="md:hidden p-2 rounded-lg"
                style={{ color: scrolled ? 'var(--color-text)' : '#fff' }}
                onClick={() => setOpen(!open)}>
          <Icon id={open ? 'x' : 'menu'} size={22} />
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t shadow-lg px-6 py-4 flex flex-col gap-3"
             style={{ borderColor: 'var(--color-border)' }}>
          {['Features', 'How it works', 'Doctors', 'FAQ'].map(label => (
            <a key={label} href={`#${label.toLowerCase().replace(/ /g, '-')}`}
               className="text-sm font-medium py-2" style={{ color: 'var(--color-text)' }}
               onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <Link to="/login" className="text-sm font-semibold text-center py-2.5 rounded-lg border"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
              Sign in
            </Link>
            <Link to="/register" className="text-sm font-semibold text-center py-2.5 rounded-lg text-white"
                  style={{ backgroundColor: 'var(--color-primary-600)' }}>
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
