import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import { DOCTORS } from './landingData';

export default function DoctorsSection() {
  return (
    <section id="doctors" className="py-24" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 reveal">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ backgroundColor: 'var(--color-insight-bg)', color: 'var(--color-insight)' }}>
            Our specialists
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-4 mb-4" style={{ color: 'var(--color-text)' }}>
            Meet the care team
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            Qualified specialists across multiple disciplines, all available through the platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DOCTORS.map(({ name, spec, qual, img }, i) => (
            <div key={i}
                 className={`reveal reveal-delay-${(i % 4) + 1} relative rounded-2xl overflow-hidden`}
                 style={{ aspectRatio: '3/4' }}>
              <img src={img} alt={name}
                   className="absolute inset-0 w-full h-full object-cover object-top" />
              <div className="absolute inset-0"
                   style={{ background: 'linear-gradient(to top, rgba(5,46,22,0.92) 0%, rgba(5,46,22,0.4) 45%, transparent 100%)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="font-bold text-sm text-white mb-0.5">{name}</div>
                <div className="text-xs font-semibold mb-0.5" style={{ color: '#' }}>{spec}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{qual}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 reveal">
          <Link to="/register"
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 rounded-xl"
                style={{ height: 'var(--btn-h-md)', backgroundColor: 'var(--color-primary-600)', color: '#fff' }}>
            Book with a specialist
            <Icon id="arrow-right" size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
