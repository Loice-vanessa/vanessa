import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';

// ── Scroll-reveal hook ────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── Data ──────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '4,800+', label: 'Patients served' },
  { value: '120+',   label: 'Specialist doctors' },
  { value: '98%',    label: 'Appointment kept rate' },
  { value: '24 / 7', label: 'Record access' },
];

const FEATURES = [
  {
    icon: 'calendar',
    title: 'Smart scheduling',
    body: 'Browse real-time doctor availability and book appointments in under a minute — no phone calls, no waiting.',
  },
  {
    icon: 'file-text',
    title: 'Unified medical records',
    body: 'Every diagnosis, prescription and clinical note lives in one secure place, accessible whenever you need it.',
  },
  {
    icon: 'shield',
    title: 'Privacy by design',
    body: 'Role-based access ensures patients see only their own data and doctors see only their assigned patients.',
  },
  {
    icon: 'stethoscope',
    title: 'Doctor portal',
    body: 'Clinicians manage their schedule, confirm appointments and write records from a single, focused workspace.',
  },
  {
    icon: 'activity',
    title: 'Health at a glance',
    body: 'Dashboards surface what matters — upcoming visits, recent records, and key health stats — instantly.',
  },
  {
    icon: 'users',
    title: 'Multi-role platform',
    body: 'Patients, doctors and administrators each get a tailored experience built around their specific workflow.',
  },
];

const STEPS = [
  { n: '01', title: 'Create your account', body: 'Register as a patient in seconds. Your profile is private and secure from day one.' },
  { n: '02', title: 'Find the right doctor', body: 'Browse specialists by name or discipline and view their live availability calendar.' },
  { n: '03', title: 'Book an appointment', body: 'Pick a slot that works for you. Confirmation is instant — no back-and-forth.' },
  { n: '04', title: 'Access your records', body: 'After your visit, your doctor writes the record directly into the platform. It\'s yours to keep.' },
];

const DOCTORS = [
  { name: 'Dr. Sarah Mutesi',      spec: 'Cardiology',       qual: 'MD',             initials: 'SM', color: '#16A34A' },
  { name: 'Dr. James Mugisha',     spec: 'General Practice', qual: 'MBBS',           initials: 'JM', color: '#0F766E' },
  { name: 'Dr. Aline Umutoni',     spec: 'Pediatrics',       qual: 'MD, Pediatrics', initials: 'AU', color: '#7C3AED' },
  { name: 'Dr. Patrick Niyonsenga',spec: 'Dermatology',      qual: 'MBChB',          initials: 'PN', color: '#D97706' },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navBg = scrolled
    ? 'bg-white/95 backdrop-blur-md shadow-sm'
    : 'bg-transparent';
  const logoColor  = scrolled ? 'var(--color-primary-600)' : '#fff';
  const textColor  = scrolled ? 'var(--color-text)'        : 'rgba(255,255,255,0.9)';
  const borderColor = scrolled ? 'var(--color-border)' : 'rgba(255,255,255,0.2)';

  return (
    <header
      data-scrolled={String(scrolled)}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      style={{ height: 'var(--nav-top-h)' }}
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
               style={{ backgroundColor: scrolled ? 'var(--color-primary-600)' : 'rgba(255,255,255,0.2)' }}>
            <Icon id="heart" size={16} style={{ color: scrolled ? '#fff' : '#fff' }} />
          </div>
          <span className="text-lg font-bold tracking-tight" style={{ color: logoColor }}>
            DHAMS
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {['Features', 'How it works', 'Doctors'].map(label => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/ /g, '-')}`}
              className="nav-link"
              style={{ color: textColor }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold px-4 rounded-lg flex items-center"
            style={{ height: 'var(--btn-h-sm)', color: scrolled ? 'var(--color-text)' : '#fff',
                     border: `1.5px solid ${borderColor}` }}
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm font-semibold px-4 rounded-lg flex items-center"
            style={{ height: 'var(--btn-h-sm)',
                     backgroundColor: scrolled ? 'var(--color-primary-600)' : '#fff',
                     color: scrolled ? '#fff' : 'var(--color-primary-800)' }}
          >
            Get started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: scrolled ? 'var(--color-text)' : '#fff' }}
          onClick={() => setOpen(!open)}
        >
          <Icon id={open ? 'x' : 'menu'} size={22} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-lg px-6 py-4 flex flex-col gap-3"
             style={{ borderColor: 'var(--color-border)' }}>
          {['Features', 'How it works', 'Doctors'].map(label => (
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

function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #052E16 0%, #14532D 50%, #134E4A 100%)' }}
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-5"
           style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
                    backgroundSize: '48px 48px' }} />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
           style={{ backgroundColor: 'var(--color-primary-400)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
           style={{ backgroundColor: 'var(--color-forest-300)' }} />

      <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-semibold tracking-wide uppercase"
             style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--color-primary-200)',
                      border: '1px solid rgba(255,255,255,0.15)' }}>
          <Icon id="shield" size={12} />
          Secure · Private · Professional
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
          Healthcare management<br />
          <span style={{ color: 'var(--color-primary-400)' }}>built for everyone</span>
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
           style={{ color: 'rgba(255,255,255,0.72)' }}>
          Book appointments, access your medical records, and stay connected with your care team —
          all in one secure, easy-to-use platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="flex items-center gap-2 px-8 text-sm font-bold rounded-xl w-full sm:w-auto justify-center"
            style={{ height: 'var(--btn-h-xl)', backgroundColor: 'var(--color-primary-400)',
                     color: 'var(--color-primary-900)' }}
          >
            Create free account
            <Icon id="arrow-right" size={16} />
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 px-8 text-sm font-semibold rounded-xl w-full sm:w-auto justify-center"
            style={{ height: 'var(--btn-h-xl)', backgroundColor: 'rgba(255,255,255,0.1)',
                     color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)' }}
          >
            Sign in to your account
          </Link>
        </div>

        {/* Trust line */}
        <div className="flex items-center justify-center gap-6 mt-12 flex-wrap">
          {['No credit card required', 'HIPAA-aligned design', 'Free for patients'].map(t => (
            <div key={t} className="flex items-center gap-1.5 text-sm"
                 style={{ color: 'rgba(255,255,255,0.55)' }}>
              <Icon id="check" size={13} style={{ color: 'var(--color-primary-400)' }} />
              {t}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
           style={{ color: 'rgba(255,255,255,0.35)' }}>
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <Icon id="chevron-down" size={16} />
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section className="bg-white border-b" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map(({ value, label }, i) => (
          <div key={i} className={`text-center reveal reveal-delay-${i + 1}`}>
            <div className="text-3xl font-extrabold mb-1" style={{ color: 'var(--color-primary-600)', fontFamily: 'var(--font-mono)' }}>
              {value}
            </div>
            <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-24" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-6xl mx-auto px-6">
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
            <div
              key={i}
              className={`reveal reveal-delay-${(i % 3) + 1} p-6 rounded-2xl border bg-white`}
              style={{ borderColor: 'var(--color-border)' }}
            >
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

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
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
              {/* Connector line */}
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

function DoctorsSection() {
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
          {DOCTORS.map(({ name, spec, qual, initials, color }, i) => (
            <div
              key={i}
              className={`reveal reveal-delay-${(i % 4) + 1} bg-white rounded-2xl border p-6 text-center`}
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white"
                   style={{ backgroundColor: color }}>
                {initials}
              </div>
              <div className="font-bold text-sm mb-1" style={{ color: 'var(--color-text)' }}>{name}</div>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--color-primary-600)' }}>{spec}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>{qual}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 reveal">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-sm font-semibold px-6 rounded-xl"
            style={{ height: 'var(--btn-h-md)', backgroundColor: 'var(--color-primary-600)', color: '#fff' }}
          >
            Book with a specialist
            <Icon id="arrow-right" size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function RoleSplit() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Patient card */}
          <div className="reveal rounded-2xl p-8 border"
               style={{ backgroundColor: 'var(--color-primary-50)', borderColor: 'var(--color-primary-200)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                 style={{ backgroundColor: 'var(--color-primary-600)' }}>
              <Icon id="user" size={22} style={{ color: '#fff' }} />
            </div>
            <h3 className="text-xl font-extrabold mb-3" style={{ color: 'var(--color-primary-900)' }}>
              For patients
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-primary-800)' }}>
              Take control of your health. Book appointments, view your full medical history,
              and manage your profile — all from your phone or desktop.
            </p>
            <ul className="flex flex-col gap-2 mb-8">
              {['Book & manage appointments', 'View diagnoses & prescriptions', 'Track your health over time', 'Secure profile management'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: 'var(--color-primary-800)' }}>
                  <Icon id="check" size={14} style={{ color: 'var(--color-primary-600)' }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 text-sm font-bold px-6 rounded-xl"
              style={{ height: 'var(--btn-h-md)', backgroundColor: 'var(--color-primary-600)', color: '#fff' }}
            >
              Register as patient
              <Icon id="arrow-right" size={15} />
            </Link>
          </div>

          {/* Doctor card */}
          <div className="reveal reveal-delay-2 rounded-2xl p-8 border"
               style={{ backgroundColor: 'var(--color-forest-50)', borderColor: 'var(--color-forest-300)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                 style={{ backgroundColor: 'var(--color-forest-600)' }}>
              <Icon id="stethoscope" size={22} style={{ color: '#fff' }} />
            </div>
            <h3 className="text-xl font-extrabold mb-3" style={{ color: 'var(--color-forest-700)' }}>
              For doctors
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-forest-700)' }}>
              A focused clinical workspace. Manage your availability, confirm appointments,
              write records, and keep track of your patient list — without the admin overhead.
            </p>
            <ul className="flex flex-col gap-2 mb-8">
              {['Manage availability & schedule', 'Confirm or cancel appointments', 'Write & store medical records', 'Full patient history at a glance'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm font-medium"
                    style={{ color: 'var(--color-forest-700)' }}>
                  <Icon id="check" size={14} style={{ color: 'var(--color-forest-600)' }} />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-bold px-6 rounded-xl"
              style={{ height: 'var(--btn-h-md)', backgroundColor: 'var(--color-forest-600)', color: '#fff' }}
            >
              Doctor sign in
              <Icon id="arrow-right" size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24"
             style={{ background: 'linear-gradient(135deg, #052E16 0%, #14532D 60%, #134E4A 100%)' }}>
      <div className="max-w-3xl mx-auto px-6 text-center reveal">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
             style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <Icon id="heart" size={28} style={{ color: 'var(--color-primary-400)' }} />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Your health, organised.
        </h2>
        <p className="text-base mb-10" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Join thousands of patients and doctors already using DHAMS to make healthcare simpler,
          faster and more transparent.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="flex items-center gap-2 px-8 text-sm font-bold rounded-xl w-full sm:w-auto justify-center"
            style={{ height: 'var(--btn-h-xl)', backgroundColor: 'var(--color-primary-400)',
                     color: 'var(--color-primary-900)' }}
          >
            Get started for free
            <Icon id="arrow-right" size={16} />
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 px-8 text-sm font-semibold rounded-xl w-full sm:w-auto justify-center"
            style={{ height: 'var(--btn-h-xl)', backgroundColor: 'rgba(255,255,255,0.1)',
                     color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)' }}
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t py-10" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
               style={{ backgroundColor: 'var(--color-primary-600)' }}>
            <Icon id="heart" size={13} style={{ color: '#fff' }} />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>DHAMS</span>
          <span className="text-sm" style={{ color: 'var(--color-text-subtle)' }}>
            — Digital Health & Appointment Management System
          </span>
        </div>
        <div className="flex items-center gap-6">
          {['Features', 'How it works', 'Doctors'].map(label => (
            <a key={label} href={`#${label.toLowerCase().replace(/ /g, '-')}`}
               className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
              {label}
            </a>
          ))}
          <Link to="/login" className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
            Sign in
          </Link>
        </div>
        <p className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
          © {new Date().getFullYear()} DHAMS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Landing() {
  useReveal();
  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <NavBar />
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <DoctorsSection />
      <RoleSplit />
      <CTA />
      <Footer />
    </div>
  );
}
