import { useEffect, useState } from 'react';
import Icon from '../../components/Icon';
import api from '../../api/axios';

const EMPTY = { fullName: '', email: '', password: '', phone: '', specialization: '', qualification: '' };

export default function AdminDoctors() {
  const [doctors,  setDoctors]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(EMPTY);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');

  function load() {
    setLoading(true);
    api.get('/doctors').then(r => setDoctors(r.data)).catch(() => {}).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleAdd(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post('/doctors', form);
      setForm(EMPTY);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create doctor.');
    } finally {
      setSaving(false);
    }
  }

  const inputCls = 'w-full px-3 text-sm rounded-lg border outline-none';
  const inputStyle = { height: 'var(--input-h-desktop)', borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Doctors</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{doctors.length} registered doctors</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-sm font-semibold px-4 rounded-xl"
          style={{ height: 'var(--btn-h-md)', backgroundColor: 'var(--color-primary-600)', color: '#fff' }}>
          <Icon id={showForm ? 'x' : 'plus'} size={15} />
          {showForm ? 'Cancel' : 'Add Doctor'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="rounded-xl p-5 flex flex-col gap-4"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>New Doctor</h3>
          {error && (
            <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)' }}>{error}</p>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { name: 'fullName',       placeholder: 'Full name',      type: 'text' },
              { name: 'email',          placeholder: 'Email',          type: 'email' },
              { name: 'password',       placeholder: 'Password',       type: 'password' },
              { name: 'phone',          placeholder: 'Phone',          type: 'text' },
              { name: 'specialization', placeholder: 'Specialization', type: 'text' },
              { name: 'qualification',  placeholder: 'Qualification',  type: 'text' },
            ].map(f => (
              <input key={f.name} name={f.name} type={f.type} placeholder={f.placeholder}
                value={form[f.name]} onChange={set} required
                className={inputCls} style={inputStyle} />
            ))}
          </div>
          <button type="submit" disabled={saving}
            className="self-start flex items-center gap-2 text-sm font-semibold px-5 rounded-xl disabled:opacity-60"
            style={{ height: 'var(--btn-h-md)', backgroundColor: 'var(--color-primary-600)', color: '#fff' }}>
            {saving ? <><Icon id="loader" size={14} className="animate-spin" /> Saving…</> : 'Save Doctor'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
      ) : doctors.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <Icon id="stethoscope" size={36} color="var(--color-border-strong)" />
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>No doctors found.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block rounded-xl overflow-hidden"
            style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-subtle)' }}>
                  {['Doctor', 'Specialization', 'Qualification', 'Phone'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                      style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {doctors.map((d, i) => (
                  <tr key={d.id} style={{ borderBottom: i < doctors.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-xs"
                          style={{ width: 32, height: 32, background: 'var(--color-primary-600)' }}>
                          {d.fullname?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--color-text)' }}>{d.fullname}</p>
                          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{d.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{d.specialization ?? '—'}</td>
                    <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{d.qualification ?? '—'}</td>
                    <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{d.phone ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-3">
            {doctors.map(d => (
              <div key={d.id} className="flex items-center gap-3 rounded-xl p-3"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div className="rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-sm"
                  style={{ width: 40, height: 40, background: 'var(--color-primary-600)' }}>
                  {d.fullname?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>{d.fullname}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{d.specialization ?? '—'} · {d.email}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
