import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import heroBg from '../../assets/hero.png';

export default function Hero() {
  return (
    <section className="relative flex items-center overflow-hidden" style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <img src={heroBg} alt="" aria-hidden="true"
           className="absolute inset-0 w-full h-full object-cover object-center" />

      <div className="absolute inset-0"
           style={{ background: 'linear-gradient(to bottom, rgba(5,46,22,0.88) 0%, rgba(5,46,22,0.80) 70%, rgba(5,46,22,0.70) 100%)' }} />

      <div className="relative w-full max-w-3xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-semibold tracking-widest uppercase"
             style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--color-primary-200)',
                      border: '1px solid rgba(255,255,255,0.18)' }}>
          <Icon id="shield" size={11} />
          Secure · Private · Professional
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
          Healthcare management<br />
          <span style={{ color: 'var(--color-primary-400)' }}>built for everyone</span>
        </h1>

        <p className="text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
           style={{ color: 'rgba(255,255,255,0.72)' }}>
          Book appointments, access your medical records, and stay connected
          with your care team — all in one secure, easy-to-use platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register"
                className="flex items-center justify-center gap-2 px-7 text-sm font-bold rounded-xl"
                style={{ height: 'var(--btn-h-xl)', backgroundColor: 'var(--color-primary-400)',
                         color: 'var(--color-primary-900)' }}>
            Create free account
            <Icon id="arrow-right" size={16} />
          </Link>
          <Link to="/login"
                className="flex items-center justify-center gap-2 px-7 text-sm font-semibold rounded-xl"
                style={{ height: 'var(--btn-h-xl)', backgroundColor: 'rgba(255,255,255,0.08)',
                         color: '#fff', border: '1.5px solid rgba(255,255,255,0.22)' }}>
            Sign in to your account
          </Link>
        </div>

        <div className="flex flex-wrap gap-5 mt-10 justify-center">
          {['No credit card required', 'HIPAA-aligned design', 'Free for patients'].map(t => (
            <div key={t} className="flex items-center gap-1.5 text-sm"
                 style={{ color: 'rgba(255,255,255,0.5)' }}>
              <Icon id="check" size={13} style={{ color: 'var(--color-primary-400)' }} />
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
