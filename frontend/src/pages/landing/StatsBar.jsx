import { STATS } from './landingData';

export default function StatsBar() {
  return (
    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6" style={{ marginTop: '-64px' }}>
      <div className="grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden shadow-xl border"
           style={{ backgroundColor: 'white', borderColor: 'var(--color-border)' }}>
        {STATS.map(({ value, label }, i) => (
          <div key={i}
               className={`reveal reveal-delay-${i + 1} text-center px-4 py-7 sm:px-6 sm:py-8`}
               style={{
                 borderColor: 'var(--color-border)',
                 borderRightWidth: i % 2 === 0 ? '1px' : '0',
                 borderRightStyle: 'solid',
                 borderBottomWidth: i < 2 ? '1px' : '0',
                 borderBottomStyle: 'solid',
               }}>
            <div className="text-2xl sm:text-3xl font-extrabold mb-1"
                 style={{ color: 'var(--color-primary-600)', fontFamily: 'var(--font-mono)' }}>
              {value}
            </div>
            <div className="text-xs sm:text-sm" style={{ color: 'var(--color-text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
