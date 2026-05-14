import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Icon from '../../components/Icon';
import AuthLayout from '../../components/AuthLayout';
import { AuthLogo, Field, ErrorBanner } from '../../components/AuthPrimitives';
import { inputCls, inputStyle } from '../../components/authStyles';

const SPECIALIZATIONS = [
  'General Practice', 'Cardiology', 'Dermatology', 'Endocrinology',
  'Gastroenterology', 'Neurology', 'Obstetrics & Gynecology',
  'Oncology', 'Ophthalmology', 'Orthopedics', 'Pediatrics',
  'Psychiatry', 'Radiology', 'Surgery', 'Urology',
];

const PATIENT_STEPS = [
  { title: 'Who are you?',      subtitle: 'Choose your role to get started' },
  { title: 'Basic info',        subtitle: 'Tell us a bit about yourself' },
  { title: 'Account security',  subtitle: 'Set up your login credentials' },
  { title: 'Personal details',  subtitle: 'A few more details about you' },
];

const DOCTOR_STEPS = [
  { title: 'Who are you?',      subtitle: 'Choose your role to get started' },
  { title: 'Basic info',        subtitle: 'Tell us a bit about yourself' },
  { title: 'Account security',  subtitle: 'Set up your login credentials' },
  { title: 'Professional info', subtitle: 'Your medical credentials' },
];

export default function Register() {
  const navigate = useNavigate();
  const [isDoctor, setIsDoctor] = useState(false);
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '',
    gender: '', address: '', dateOfBirth: '',
    specialization: '', qualification: '',
  });

  const steps = isDoctor ? DOCTOR_STEPS : PATIENT_STEPS;
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const next = () => { setError(''); setStep((s) => s + 1); };
  const back = () => { setError(''); setStep((s) => s - 1); };

  const canProceed = () => {
    if (step === 1) return form.fullName.trim() && form.phone.trim();
    if (step === 2) return form.email.trim() && form.password.length >= 8;
    if (step === 3 && isDoctor) return form.specialization && form.qualification.trim();
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isDoctor ? '/auth/register/doctor' : '/auth/register/patient';
      const payload = isDoctor
        ? { fullName: form.fullName, email: form.email, password: form.password, phone: form.phone, specialization: form.specialization, qualification: form.qualification }
        : { fullName: form.fullName, email: form.email, password: form.password, phone: form.phone, gender: form.gender, address: form.address, dateOfBirth: form.dateOfBirth || null };

      const { data } = await api.post(endpoint, payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('email', data.email);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('fullName', data.fullName || form.fullName);
      localStorage.setItem('name', data.fullName || form.fullName);
      navigate(isDoctor ? '/doctor/dashboard' : '/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isLastStep = step === steps.length - 1;

  return (
    <AuthLayout>
      <AuthLogo />

      {/* progress bar */}
      <div className="flex items-center gap-1.5 mb-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full flex-1 transition-all duration-300"
            style={{ backgroundColor: i <= step ? 'var(--color-primary-600)' : 'var(--color-border)' }}
          />
        ))}
      </div>

      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--color-primary-600)' }}>
        Step {step + 1} of {steps.length}
      </p>
      <h1 className="text-xl font-bold mb-0.5" style={{ color: 'var(--color-text)' }}>{steps[step].title}</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>{steps[step].subtitle}</p>

      <ErrorBanner message={error} />

      <form
        onSubmit={isLastStep ? handleSubmit : (e) => { e.preventDefault(); if (canProceed()) next(); }}
        className="flex flex-col gap-4"
      >
        {/* Step 0 — role */}
        {step === 0 && (
          <div
            className="flex rounded-xl p-1"
            style={{ backgroundColor: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}
          >
            {[
              { label: 'I am a Patient', icon: 'user',         value: false },
              { label: 'I am a Doctor',  icon: 'stethoscope',  value: true  },
            ].map(({ label, icon, value }) => (
              <button
                key={label}
                type="button"
                onClick={() => setIsDoctor(value)}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold rounded-lg py-3 transition-all cursor-pointer"
                style={isDoctor === value
                  ? { backgroundColor: value ? 'var(--color-primary-600)' : 'var(--color-surface)', color: value ? '#fff' : 'var(--color-text)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                  : { color: 'var(--color-text-muted)' }
                }
              >
                <Icon id={icon} size={15} />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Step 1 — basic info */}
        {step === 1 && (
          <>
            <Field label="Full name" icon="user">
              <input type="text" name="fullName" value={form.fullName} onChange={set} required placeholder="John Doe" className={inputCls()} style={inputStyle} />
            </Field>
            <Field label="Phone number" icon="phone">
              <input type="tel" name="phone" value={form.phone} onChange={set} required placeholder="+250 700 000 000" className={inputCls()} style={inputStyle} />
            </Field>
          </>
        )}

        {/* Step 2 — credentials */}
        {step === 2 && (
          <>
            <Field label="Email address" icon="mail">
              <input type="email" name="email" value={form.email} onChange={set} required placeholder="you@example.com" className={inputCls()} style={inputStyle} />
            </Field>
            <Field label="Password" icon="lock">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password" value={form.password} onChange={set}
                required placeholder="Min. 8 characters"
                className="w-full pl-9 pr-10 text-sm rounded-lg border outline-none"
                style={inputStyle}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" style={{ color: 'var(--color-text-subtle)' }}>
                <Icon id={showPassword ? 'eye-off' : 'eye'} size={15} />
              </button>
            </Field>
          </>
        )}

        {/* Step 3 — patient details */}
        {step === 3 && !isDoctor && (
          <>
            <Field label="Gender" icon={null}>
              <select name="gender" value={form.gender} onChange={set} className={inputCls(false)} style={{ ...inputStyle, appearance: 'none' }}>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </Field>
            <Field label="Date of birth" icon="calendar">
              <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={set} className={inputCls()} style={inputStyle} />
            </Field>
            <Field label="Address" icon="map-pin">
              <input type="text" name="address" value={form.address} onChange={set} placeholder="Kigali, Rwanda" className={inputCls()} style={inputStyle} />
            </Field>
          </>
        )}

        {/* Step 3 — doctor details */}
        {step === 3 && isDoctor && (
          <>
            <Field label="Specialization" icon="briefcase">
              <select name="specialization" value={form.specialization} onChange={set} required className={inputCls()} style={{ ...inputStyle, appearance: 'none' }}>
                <option value="">Select specialization</option>
                {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Qualification" icon="award">
              <input type="text" name="qualification" value={form.qualification} onChange={set} required placeholder="e.g. MD, MBBS, PhD" className={inputCls()} style={inputStyle} />
            </Field>
          </>
        )}

        {/* nav buttons */}
        <div className={`flex gap-3 mt-2 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
          {step > 0 && (
            <button
              type="button" onClick={back}
              className="flex items-center gap-1.5 text-sm font-semibold px-5 rounded-lg cursor-pointer"
              style={{ height: 'var(--btn-h-md)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface)' }}
            >
              <Icon id="chevron-right" size={14} className="rotate-180" /> Back
            </button>
          )}
          <button
            type="submit"
            disabled={!canProceed() || loading}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold rounded-lg cursor-pointer disabled:opacity-50"
            style={{ height: 'var(--btn-h-md)', backgroundColor: 'var(--color-primary-600)', color: '#fff' }}
          >
            {loading
              ? <><Icon id="loader" size={15} className="animate-spin" /> Creating account…</>
              : isLastStep
                ? `Create ${isDoctor ? 'doctor' : 'patient'} account`
                : <>Continue <Icon id="chevron-right" size={14} /></>
            }
          </button>
        </div>
      </form>

      <p className="text-sm text-center mt-5" style={{ color: 'var(--color-text-muted)' }}>
        Already have an account?{' '}
        <Link to="/login" className="font-semibold" style={{ color: 'var(--color-primary-600)' }}>Sign in</Link>
      </p>
    </AuthLayout>
  );
}
