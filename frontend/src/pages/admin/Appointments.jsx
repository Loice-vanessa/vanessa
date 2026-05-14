import { useEffect, useState } from 'react';
import Icon from '../../components/Icon';
import api from '../../api/axios';

const STATUS_MAP = {
  PENDING:   { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)',  label: 'Pending' },
  CONFIRMED: { bg: 'var(--color-success-bg)', color: 'var(--color-success)',  label: 'Confirmed' },
  COMPLETED: { bg: 'var(--color-info-bg)',    color: 'var(--color-info)',     label: 'Completed' },
  CANCELLED: { bg: 'var(--color-error-bg)',   color: 'var(--color-error)',    label: 'Cancelled' },
};

const FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filter,       setFilter]       = useState('ALL');
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    api.get('/appointments/all').then(r => setAppointments(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Appointments</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>All appointments across the platform.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            style={{
              backgroundColor: filter === f ? 'var(--color-primary-600)' : 'var(--color-surface)',
              color: filter === f ? '#fff' : 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
            }}>
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <Icon id="calendar" size={36} color="var(--color-border-strong)" />
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>No appointments found.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl overflow-hidden"
            style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-subtle)' }}>
                  {['Patient', 'Doctor', 'Date', 'Time', 'Note', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                      style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => {
                  const s = STATUS_MAP[a.status] || STATUS_MAP.PENDING;
                  return (
                    <tr key={a.appointmentId} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                      <td className="px-5 py-3 font-medium" style={{ color: 'var(--color-text)' }}>{a.patient?.fullname ?? '—'}</td>
                      <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{a.doctor?.fullname ?? '—'}</td>
                      <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{a.date}</td>
                      <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{a.time}</td>
                      <td className="px-5 py-3 max-w-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{a.note || '—'}</td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: s.bg, color: s.color }}>{s.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3">
            {filtered.map(a => {
              const s = STATUS_MAP[a.status] || STATUS_MAP.PENDING;
              return (
                <div key={a.appointmentId} className="rounded-xl p-3 flex items-start gap-3"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <div className="rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-sm"
                    style={{ width: 40, height: 40, background: 'var(--color-primary-600)' }}>
                    {a.patient?.fullname?.charAt(0) ?? 'P'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>{a.patient?.fullname ?? '—'}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{a.doctor?.fullname ?? '—'}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{a.date} · {a.time}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: s.bg, color: s.color }}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
