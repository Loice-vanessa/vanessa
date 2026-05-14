import { useEffect, useState } from 'react';
import Icon from '../../components/Icon';
import api from '../../api/axios';

const STATUS_MAP = {
  PENDING:   { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)',  label: 'Pending' },
  CONFIRMED: { bg: 'var(--color-success-bg)', color: 'var(--color-success)',  label: 'Confirmed' },
  COMPLETED: { bg: 'var(--color-info-bg)',    color: 'var(--color-info)',     label: 'Completed' },
  CANCELLED: { bg: 'var(--color-error-bg)',   color: 'var(--color-error)',    label: 'Cancelled' },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.PENDING;
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
      style={{ background: s.bg, color: s.color }}>{s.label}</span>
  );
}

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
          {value}
        </p>
        <p className="text-xs mt-1 truncate" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
      </div>
    </div>
  );
}

export default function DoctorDashboard() {
  const doctorId = localStorage.getItem('userId');
  const name      = localStorage.getItem('name') || localStorage.getItem('fullName') || 'Doctor';
  const firstName  = name.includes('@') ? 'there' : name.split(' ')[0];

  const [appointments, setAppointments] = useState([]);
  const [patients,     setPatients]     = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    if (!doctorId) { setLoading(false); return; }
    Promise.all([
      api.get(`/doctors/${doctorId}/schedule`),
      api.get(`/doctors/${doctorId}/patients`),
    ]).then(([aptsRes, patsRes]) => {
      setAppointments(aptsRes.data);
      setPatients(patsRes.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [doctorId]);

  const today     = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter(a => a.date === today);
  const pending   = appointments.filter(a => a.status === 'PENDING').length;

  const STATS = [
    { label: 'Total Appointments', value: appointments.length, icon: 'calendar',  color: 'var(--color-primary-600)', bg: 'var(--color-primary-50)' },
    { label: 'Today',              value: todayApts.length,    icon: 'clock',     color: 'var(--color-info)',        bg: 'var(--color-info-bg)' },
    { label: 'Pending Approval',   value: pending,             icon: 'alert-circle', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
    { label: 'Total Patients',     value: patients.length,     icon: 'users',     color: 'var(--color-insight)',     bg: 'var(--color-insight-bg)' },
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div>
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Good morning, {firstName} 👋
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Here's your practice overview for today.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Today's appointments */}
      <section>
        <h3 className="font-semibold text-sm md:text-base mb-3" style={{ color: 'var(--color-text)' }}>
          Today's Appointments
        </h3>
        {loading ? (
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
        ) : todayApts.length === 0 ? (
          <div className="rounded-xl p-8 text-center" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <Icon id="calendar" size={36} color="var(--color-border-strong)" />
            <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>No appointments scheduled for today.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {todayApts.map(apt => (
              <div key={apt.appointmentId} className="flex items-center gap-3 rounded-xl p-3 md:p-4"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div className="rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-sm"
                  style={{ width: 40, height: 40, background: 'var(--color-primary-600)' }}>
                  {apt.patient?.fullname?.charAt(0) ?? 'P'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>
                    {apt.patient?.fullname ?? 'Patient'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{apt.note || 'No note'}</p>
                </div>
                <p className="text-sm font-medium shrink-0 hidden sm:block" style={{ color: 'var(--color-text)' }}>
                  {apt.time}
                </p>
                <StatusBadge status={apt.status} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent patients */}
      <section>
        <h3 className="font-semibold text-sm md:text-base mb-3" style={{ color: 'var(--color-text)' }}>
          Recent Patients
        </h3>

        {/* Desktop table */}
        <div className="hidden md:block rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-subtle)' }}>
                {['Patient', 'Gender', 'Blood Group', 'Phone'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {patients.slice(0, 5).map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < Math.min(patients.length, 5) - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-xs"
                        style={{ width: 32, height: 32, background: 'var(--color-primary-600)' }}>
                        {p.fullname?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>{p.fullname}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{p.phone ?? '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{p.gender ?? '—'}</td>
                  <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{p.bloodGroup ?? '—'}</td>
                  <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{p.phone ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden flex flex-col gap-3">
          {patients.slice(0, 5).map(p => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl p-3"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <div className="rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-sm"
                style={{ width: 40, height: 40, background: 'var(--color-primary-600)' }}>
                {p.fullname?.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>{p.fullname}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{p.phone ?? '—'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
