import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-white border-t py-10" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

        {/* Brand */}
        <div className="flex items-center gap-2 flex-wrap">
          <Logo variant="light" size="sm" />
          <span className="hidden sm:inline text-sm" style={{ color: 'var(--color-text-subtle)' }}>
            — Digital Health & Appointment Management System
          </span>
        </div>

        {/* Nav links */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {['Features', 'How it works', 'Doctors', 'FAQ'].map(label => (
            <a key={label} href={`#${label.toLowerCase().replace(/ /g, '-')}`}
               className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
              {label}
            </a>
          ))}
          <Link to="/login" className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
            Sign in
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
          © {new Date().getFullYear()} DHAMS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
