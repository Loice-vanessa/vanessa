import Icon from '../../components/Icon';
import { FEATURES } from './landingData';

export default function Features() {
  return (
    <section id="features" className="pb-16 sm:pb-24" style={{ backgroundColor: 'var(--color-bg)', paddingTop: '7rem' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 reveal">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}>
            Platform features
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-4 mb-4" style={{ color: 'var(--color-text)' }}>
            Everything your care needs
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            From first booking to long-term health history, DHAMS covers the full patient journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon, title, body }, i) => (
            <div key={i}
                 className={`reveal reveal-delay-${(i % 3) + 1} p-6 rounded-2xl border bg-white`}
                 style={{ borderColor: 'var(--color-border)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                   style={{ backgroundColor: 'var(--color-primary-50)' }}>
                <Icon id={icon} size={20} style={{ color: 'var(--color-primary-600)' }} />
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--color-text)' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
