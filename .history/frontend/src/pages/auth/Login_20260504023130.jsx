import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Icon from '../../components/Icon';

const inputStyle = {
  height: 'var(--input-h-desktop)',
  borderColor: 'var(--color-border)',
  backgroundColor: 'rgba(255,255,255,0.92)',
  color: 'var(--color-text)',
};

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('email', data.email);
      if (data.role === 'DOCTOR') navigate('/doctor/dashboard');
      else if (data.role === 'PATIENT') navigate('/patient/dashboard');
      else navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundImage: 'url(/auth.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: 'var(--color-primary-900)',
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(5,46,22,0.55)' }} />

      {/* card */}
      <div
        className="relative w-full max-w-[400px] rounded-2xl p-8 shadow-2xl"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* logo */}
        <div className="flex items-center gap-2 mb-7">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}
          >
            <Icon id="stethoscope" size={18} />
          </span>
          <span className="font-bold text-base tracking-tight" style={{ color: 'var(--color-text)' }}>DHAMS</span>
        </div>

        <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>Welcome back</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>Sign in to your account to continue</p>

        {error && (
          <div
            className="flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg mb-5"
            style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)' }}
          >
            <Icon id="alert-circle" size={15} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
              Email address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-subtle)' }}>
                <Icon id="mail" size={15} />
              </span>
              <input
                type="email" name="email" value={form.email} onChange={set}
                required placeholder="you@example.com"
                className="w-full pl-9 pr-4 text-sm rounded-lg border outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Password</label>
              <a href="#" className="text-xs font-medium" style={{ color: 'var(--color-primary-600)' }}>
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-subtle)' }}>
                <Icon id="lock" size={15} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password" value={form.password} onChange={set}
                required placeholder="••••••••"
                className="w-full pl-9 pr-10 text-sm rounded-lg border outline-none"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: 'var(--color-text-subtle)' }}
              >
                <Icon id={showPassword ? 'eye-off' : 'eye'} size={15} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-sm font-semibold rounded-lg mt-1 cursor-pointer disabled:opacity-60"
            style={{ height: 'var(--btn-h-md)', backgroundColor: 'var(--color-primary-600)', color: '#fff' }}
          >
            {loading
              ? <><Icon id="loader" size={15} className="animate-spin" /> Signing in…</>
              : 'Sign in'
            }
          </button>
        </form>

        <p className="text-sm text-center mt-5" style={{ color: 'var(--color-text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold" style={{ color: 'var(--color-primary-600)' }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
