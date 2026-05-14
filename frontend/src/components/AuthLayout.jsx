import { Link } from 'react-router-dom';
import Icon from './Icon';
import bgImage from '../assets/auth.png';

export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(5,46,22,0.58)' }} />

      <Link
        to="/"
        className="absolute top-5 left-5 z-10 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg"
        style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        <Icon id="arrow-left" size={13} />
        Back to home
      </Link>

      <div
        className="relative w-full max-w-[440px] rounded-2xl p-8 shadow-2xl"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {children}
      </div>
    </div>
  );
}
