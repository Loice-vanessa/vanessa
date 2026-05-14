import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import doc1 from '../../assets';
import doc2 from '../../assets/doc-1.png';

const ROLES = {
  patient: {
    img: doc1,
    label: 'For patients',
    icon: 'user',
    heading: 'Take control of your health',
    body: 'Book appointments, view your full medical history, and manage your profile — all from your phone or desktop.',
    items: ['Book & manage appointments', 'View diagnoses & prescriptions', 'Track your health over time', 'Secure profile management'],
    cta: { label: 'Register as patient', to: '/register' },
    accent: 'var(--color-primary-600)',
    accentLight: 'var(--color-primary-50)',
    accentText: 'var(--color-primary-900)',
  },
  doctor: {
    img: doc2,
    label: 'For doctors',
    icon: 'stethoscope',
    heading: 'A focused clinical workspace',
    body: 'Manage your availability, confirm appointments, write records, and keep track of your patient list — without the admin overhead.',
    items: ['Manage availability & schedule', 'Confirm or cancel appointments', 'Write & store medical records', 'Full patient history at a glance'],
    cta: { label: 'Doctor sign in', to: '/login' },
    accent: 'var(--color-forest-600)',
    accentLight: 'var(--color-forest-50)',
    accentText: 'var(--color-forest-900)',
  },
};

export default function RoleSplit() {
  const [active, setActive] = useState('patient');
  const role = ROLES[active];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Toggle tabs */}
        <div className="flex justify-center mb-10 sm:mb-12">
          <div className="inline-flex rounded-xl p-1 gap-1"
               style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
            {Object.entries(ROLES).map(([key, r]) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className="flex items-center gap-2 px-4 sm:px-5 text-sm font-semibold rounded-lg transition-all duration-200"
                style={{
                  height: 'var(--btn-h-sm)',
                  backgroundColor: active === key ? ROLES[key].accent : 'transparent',
                  color: active === key ? '#fff' : 'var(--color-text-muted)',
                }}
              >
                <Icon id={r.icon} size={14} />
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Image + content */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-10 md:items-stretch reveal">

          {/* Image — fixed height on mobile, stretches on md+ */}
          <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: '320px' }}>
            <img
              key={active}
              src={role.img}
              alt={role.label}
              className="absolute inset-0 w-full h-full object-cover object-top"
              style={{ transition: 'opacity 0.3s ease' }}
            />
            <div className="absolute inset-0"
                 style={{ background: `linear-gradient(to top, ${role.accent}cc 0%, transparent 55%)` }} />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center py-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-5 self-start"
                 style={{ backgroundColor: role.accentLight, color: role.accent }}>
              <Icon id={role.icon} size={12} />
              {role.label}
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 leading-tight"
                style={{ color: role.accentText }}>
              {role.heading}
            </h2>

            <p className="text-sm leading-relaxed mb-7" style={{ color: 'var(--color-text-muted)' }}>
              {role.body}
            </p>

            <ul className="flex flex-col gap-3 mb-8">
              {role.items.map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium"
                    style={{ color: 'var(--color-text)' }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: role.accentLight }}>
                    <Icon id="check" size={12} style={{ color: role.accent }} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <Link to={role.cta.to}
                  className="inline-flex items-center gap-2 text-sm font-bold px-6 rounded-xl self-start"
                  style={{ height: 'var(--btn-h-md)', backgroundColor: role.accent, color: '#fff' }}>
              {role.cta.label}
              <Icon id="arrow-right" size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
