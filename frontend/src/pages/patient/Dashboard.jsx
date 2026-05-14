import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import Icon from '../../components/Icon';

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

function statusTone(status) {
  if (status === 'CONFIRMED') return { bg: 'var(--color-success-bg)', color: 'var(--color-success)', label: 'Confirmed' };
  if (status === 'CANCELLED') return { bg: 'var(--color-error-bg)', color: 'var(--color-error)', label: 'Cancelled' };
  if (status === 'COMPLETED') return { bg: 'var(--color-info-bg)', color: 'var(--color-info)', label: 'Completed' };
  return { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', label: 'Pending' };
}

export default function Dashboard() {
  const name = localStorage.getItem('name') || localStorage.getItem('fullName') || 'Patient';
  const firstName = name.includes('@') ? 'there' : name.split(' ')[0];
  const patientId = localStorage.getItem('userId');
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!patientId) {
      setError('No patient profile was found for this session.');
      setLoading(false);
      return;
    }

    let ignore = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [appointmentsRes, recordsRes] = await Promise.all([
          api.get(`/patients/${patientId}/appointments`),
          api.get(`/patients/${patientId}/records`),
        ]);
        if (ignore) return;
        setAppointments(appointmentsRes.data || []);
        setRecords(recordsRes.data || []);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || 'Failed to load patient data.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => { ignore = true; };
  }, [patientId]);

  const upcoming = useMemo(() => {
    return appointments
      .filter((apt) => ['PENDING', 'CONFIRMED'].includes(apt.status))
      .slice(0, 3);
  }, [appointments]);

  const recentRecords = useMemo(() => records.slice(0, 3), [records]);

  const stats = [
    { label: 'Total Appointments', value: appointments.length, icon: 'calendar', color: 'var(--color-primary-600)', bg: 'var(--color-primary-50)' },
    { label: 'Upcoming', value: upcoming.length, icon: 'clock', color: 'var(--color-info)', bg: 'var(--color-info-bg)' },
    { label: 'Medical Records', value: records.length, icon: 'file-text', color: 'var(--color-insight)', bg: 'var(--color-insight-bg)' },
    { label: 'Completed', value: appointments.filter((apt) => apt.status === 'COMPLETED').length, icon: 'clipboard', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div>
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Good morning, {firstName} 👋
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Here is your latest health activity from the backend.
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg text-sm"
          style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm md:text-base" style={{ color: 'var(--color-text)' }}>
            Upcoming Appointments
          </h3>
        </div>

        {loading ? (
          <div className="rounded-xl p-6" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            Loading appointments...
          </div>
        ) : upcoming.length === 0 ? (
          <div className="rounded-xl p-6" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
            No upcoming appointments yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {upcoming.map((apt) => {
              const tone = statusTone(apt.status);
              return (
                <div key={apt.appointmentId} className="flex items-center gap-3 rounded-xl p-3 md:p-4"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <div className="flex items-center justify-center rounded-xl shrink-0"
                    style={{ width: 40, height: 40, background: 'var(--color-primary-50)' }}>
                    <Icon id="stethoscope" size={18} color="var(--color-primary-600)" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>
                      {apt.doctor?.fullname || 'Doctor'}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                      {apt.doctor?.specialization || 'Specialist'}
                    </p>
                  </div>
                  <div className="hidden sm:block text-right shrink-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{apt.date}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{apt.time}</p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: tone.bg, color: tone.color }}>
                    {tone.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm md:text-base" style={{ color: 'var(--color-text)' }}>
            Recent Medical Records
          </h3>
        </div>

        {loading ? (
          <div className="rounded-xl p-6" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            Loading medical records...
          </div>
        ) : recentRecords.length === 0 ? (
          <div className="rounded-xl p-6" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
            No medical records yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentRecords.map((record) => (
              <div key={record.recordId} className="rounded-xl p-4"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                  {record.diagnosis}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  {record.appointment?.doctor?.fullname || 'Doctor'} · {record.appointment?.doctor?.specialization || 'Specialist'}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-subtle)' }}>
                  {record.visitDate}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
