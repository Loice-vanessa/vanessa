import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Icon from '../../components/Icon';
import AuthLayout from '../../components/AuthLayout';
import { AuthLogo, Field, ErrorBanner } from '../../components/AuthPrimitives';
import { inputCls, inputStyle } from '../../components/authStyles';

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
      localStorage.setItem('token',  data.token);
      localStorage.setItem('role',    data.role);
      localStorage.setItem('email',   data.email);
      localStorage.setItem('userId',  data.userId ?? '');
      localStorage.setItem('name',    data.fullName || data.fullname || 'User');
      localStorage.setItem('fullName', data.fullName || data.fullname || 'User');
      if (data.role === 'DOCTOR') navigate('/doctor/dashboard');
      else if (data.role === 'PATIENT') navigate('/patient/dashboard');
      else {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        localStorage.removeItem('fullName');
        setError('Admin access is not enabled in this app.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthLogo />

      <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>Welcome back</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>Sign in to your account to continue</p>

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Email address" icon="mail">
          <input
            type="email" name="email" value={form.email} onChange={set}
            required placeholder="you@example.com"
            className={inputCls()} style={inputStyle}
          />
        </Field>

        <Field label={
          <div className="flex items-center justify-between">
            <span>Password</span>
            <a href="#" className="text-xs font-medium" style={{ color: 'var(--color-primary-600)' }}>
              Forgot password?
            </a>
          </div>
        } icon="lock">
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
        </Field>

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
    </AuthLayout>
  );
}
