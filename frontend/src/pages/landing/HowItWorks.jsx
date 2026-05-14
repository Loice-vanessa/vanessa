import { STEPS } from './landingData';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 reveal">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ backgroundColor: 'var(--color-forest-100)', color: 'var(--color-forest-600)' }}>
            How it works
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-4 mb-4" style={{ color: 'var(--color-text)' }}>
            From sign-up to care in four steps
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
            Getting started takes less than two minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map(({ n, title, body }, i) => (
            <div key={i} className={`reveal reveal-delay-${i + 1} relative`}>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-full h-px -translate-x-4"
                     style={{ backgroundColor: 'var(--color-border)' }} />
              )}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-sm font-bold"
                   style={{ backgroundColor: 'var(--color-primary-600)', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                {n}
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
