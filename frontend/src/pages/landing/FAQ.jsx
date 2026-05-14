import { useState } from 'react';
import Icon from '../../components/Icon';

const FAQS = [
  { q: 'Is DHAMS free for patients?',              a: 'Yes. Creating a patient account and booking appointments is completely free. There are no hidden fees or subscription charges.' },
  { q: 'How do I book an appointment?',            a: 'Register or sign in, browse available doctors, pick a date and time slot that suits you, and confirm. The whole process takes under a minute.' },
  { q: 'Can I access my medical records at any time?', a: 'Yes. Once your doctor writes a record after your visit it is immediately available in your patient dashboard, 24/7, from any device.' },
  { q: 'How is my data kept private?',             a: 'DHAMS uses role-based access control. Patients can only see their own records, and doctors can only access records for their assigned patients. All data is stored securely.' },
  { q: 'How do doctors join the platform?',        a: 'Doctors are onboarded by an administrator. Once your account is created you can sign in, set your availability, and start managing appointments right away.' },
  { q: 'Can I cancel or reschedule an appointment?', a: 'Yes. You can cancel an appointment from your dashboard. To reschedule, cancel the existing slot and book a new one.' },
];

function FAQItem({ q, a, open, onToggle }) {
  return (
    <div className="border-b" style={{ borderColor: 'var(--color-border)' }}>
      <button onClick={onToggle}
              className="w-full flex items-center justify-between gap-4 py-5 text-left">
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{q}</span>
        <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: open ? 'var(--color-primary-600)' : 'var(--color-primary-50)',
                       transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                       transition: 'transform 0.2s ease' }}>
          <Icon id="chevron-down" size={13} style={{ color: open ? '#fff' : 'var(--color-primary-600)' }} />
        </span>
      </button>
      {open && (
        <p className="text-sm leading-relaxed pb-5" style={{ color: 'var(--color-text-muted)' }}>{a}</p>
      )}
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="py-16 sm:py-24" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">

          <div className="reveal">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}>
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mt-4 mb-4 leading-tight"
                style={{ color: 'var(--color-text)' }}>
              Frequently asked<br className="hidden sm:block" /> questions
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              Everything you need to know about DHAMS. Can't find an answer?{' '}
              <a href="mailto:support@dhams.health" className="font-semibold"
                 style={{ color: 'var(--color-primary-600)' }}>
                Get in touch.
              </a>
            </p>
          </div>

          <div className="reveal reveal-delay-2">
            {FAQS.map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a}
                       open={openIndex === i}
                       onToggle={() => setOpenIndex(openIndex === i ? null : i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
