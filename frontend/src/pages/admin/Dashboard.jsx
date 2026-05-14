import { useEffect, useState } from 'react';
import Icon from '../../components/Icon';
import api from '../../api/axios';

const STATUS_MAP = {
  PENDING:   { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)',  label: 'Pending' },
  CONFIRMED: { bg: 'var(--color-success-bg)', color: 'var(--color-success)',  label: 'Confirmed' },
  COMPLETED: { bg: 'var(--color-info-bg)',    color: 'var(--color-info)',     label: 'Completed' },
  CANCELLED: { bg: 'var(--color-error-bg)',   color: 'var(--color-error)',    label: 'Cancelled' },
};

function StatCard({ label, value, icon, color, bg }) {
  return (
    <div className="flex items-center gap-3 rounded-xl p-4"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      <div className="flex items-center justify-center rounded-xl shrink-0"
        style={{ width: 44, height: 44, background: bg }}>
        <Icon id={icon} size={20} color={color} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold leading-none" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>
          {value ?? '—'}
        </p>
        <p className="text-xs mt-1 truncate" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const name = localStorage.getItem('name') || 'Admin';
  const firstName = name.split(' ')[0];

  const [doctors,      setDoctors]      = useState([]);
  const [patients,     setPatients]     = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/doctors'),
      api.get('/patients'),
      api.get('/appointments/all'),
    ]).then(([dRes, pRes, aRes]) => {
      setDoctors(dRes.data);
      setPatients(pRes.data);
      setAppointments(aRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const STATS = [
    { label: 'Total Doctors',      value: doctors.length,      icon: 'stethoscope',  color: 'var(--color-primary-600)', bg: 'var(--color-primary-50)' },
    { label: 'Total Patients',     value: patients.length,     icon: 'users',        color: 'var(--color-info)',        bg: 'var(--color-info-bg)' },
    { label: 'Total Appointments', value: appointments.length, icon: 'calendar',     color: 'var(--color-insight)',     bg: 'var(--color-insight-bg)' },
    { label: 'Pending',            value: appointments.filter(a => a.status === 'PENDING').length, icon: 'alert-circle', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
  ];

  const recent = [...appointments].reverse().slice(0, 10);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div>
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Welcome, {firstName} 👋
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Platform overview at a glance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <section>
        <h3 className="font-semibold text-sm md:text-base mb-3" style={{ color: 'var(--color-text)' }}>
          Recent Appointments
        </h3>
        {loading ? (
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
        ) : recent.length === 0 ? (
          <div className="rounded-xl p-8 text-center" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <Icon id="calendar" size={36} color="var(--color-border-strong)" />
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>No appointments yet.</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block rounded-xl overflow-hidden"
              style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-subtle)' }}>
                    {['Patient', 'Doctor', 'Date', 'Time', 'Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                        style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((a, i) => {
                    const s = STATUS_MAP[a.status] || STATUS_MAP.PENDING;
                    return (
                      <tr key={a.appointmentId} style={{ borderBottom: i < recent.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                        <td className="px-5 py-3 font-medium" style={{ color: 'var(--color-text)' }}>{a.patient?.fullname ?? '—'}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{a.doctor?.fullname ?? '—'}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{a.date}</td>
                        <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{a.time}</td>
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

            <div className="md:hidden flex flex-col gap-3">
              {recent.map(a => {
                const s = STATUS_MAP[a.status] || STATUS_MAP.PENDING;
                return (
                  <div key={a.appointmentId} className="rounded-xl p-3 flex items-center gap-3"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    <div className="rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-sm"
                      style={{ width: 40, height: 40, background: 'var(--color-primary-600)' }}>
                      {a.patient?.fullname?.charAt(0) ?? 'P'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>{a.patient?.fullname ?? '—'}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{a.doctor?.fullname ?? '—'} · {a.date}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                      style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
