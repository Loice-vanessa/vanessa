import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';

export default function CTA() {
  return (
    <section className="py-16 sm:py-24"
             style={{ background: 'linear-gradient(135deg, #052E16 0%, #14532D 60%, #134E4A 100%)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center reveal">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
             style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <Icon id="stethoscope" size={28} style={{ color: 'var(--color-primary-400)' }} />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Your health, organised.</h2>
        <p className="text-base mb-10" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Join thousands of patients and doctors already using DHAMS to make healthcare simpler,
          faster and more transparent.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register"
                className="flex items-center gap-2 px-8 text-sm font-bold rounded-xl w-full sm:w-auto justify-center"
                style={{ height: 'var(--btn-h-xl)', backgroundColor: 'var(--color-primary-400)',
                         color: 'var(--color-primary-900)' }}>
            Get started for free
            <Icon id="arrow-right" size={16} />
          </Link>
          <Link to="/login"
                className="flex items-center gap-2 px-8 text-sm font-semibold rounded-xl w-full sm:w-auto justify-center"
                style={{ height: 'var(--btn-h-xl)', backgroundColor: 'rgba(255,255,255,0.1)',
                         color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)' }}>
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
