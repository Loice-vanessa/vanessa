import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import Icon from '../../components/Icon';

const STATUS = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-xl p-4 md:p-5 ${className}`}
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      {children}
    </div>
  );
}

function Stat({ label, value, icon, tone = 'primary' }) {
  const tones = {
    primary: ['var(--color-primary-50)', 'var(--color-primary-600)'],
    info: ['var(--color-info-bg)', 'var(--color-info)'],
    success: ['var(--color-success-bg)', 'var(--color-success)'],
    warning: ['var(--color-warning-bg)', 'var(--color-warning)'],
  };
  const [bg, color] = tones[tone] || tones.primary;
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: 42, height: 42, background: bg }}>
          <Icon id={icon} size={19} color={color} />
        </div>
        <div className="min-w-0">
          <p className="text-xl font-bold leading-none" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>{value}</p>
          <p className="text-xs mt-1 truncate" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
        </div>
      </div>
    </Card>
  );
}

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not set';
}

function csvValue(value) {
  const text = value == null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function downloadCsv(filename, rows) {
  const csv = rows.map((row) => row.map(csvValue).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function PatientReports() {
  const patientId = localStorage.getItem('userId');
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!patientId) return;
    let ignore = false;
    async function load() {
      try {
        const [profileRes, appointmentsRes, recordsRes] = await Promise.all([
          api.get(`/patients/${patientId}`),
          api.get(`/patients/${patientId}/appointments`),
          api.get(`/patients/${patientId}/records`),
        ]);
        if (ignore) return;
        setProfile(profileRes.data);
        setAppointments(appointmentsRes.data || []);
        setRecords(recordsRes.data || []);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || 'Failed to load reports.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [patientId]);

  const report = useMemo(() => {
    const byStatus = Object.fromEntries(STATUS.map((status) => [status, appointments.filter((a) => a.status === status).length]));
    const latestRecord = records[0];
    const upcoming = appointments.filter((a) => ['PENDING', 'CONFIRMED'].includes(a.status)).length;
    return { byStatus, latestRecord, upcoming };
  }, [appointments, records]);

  function exportReport() {
    const rows = [
      ['DHAMS Patient Report'],
      ['Patient', profile?.fullname || 'Patient'],
      ['Generated', new Date().toLocaleString('en-GB')],
      [],
      ['Summary'],
      ['Appointments', appointments.length],
      ['Upcoming', report.upcoming],
      ['Medical Records', records.length],
      ['Completed Visits', report.byStatus.COMPLETED],
      [],
      ['Insurance'],
      ['Provider', profile?.insuranceProvider || 'No provider added'],
      ['Coverage Type', profile?.insuranceCoverageType || 'Not set'],
      ['Member Number', profile?.insuranceMemberNumber || 'Not set'],
      ['Expiry Date', formatDate(profile?.insuranceExpiryDate)],
      [],
      ['Appointments'],
      ['Date', 'Time', 'Doctor', 'Specialization', 'Status', 'Note'],
      ...appointments.map((appointment) => [
        appointment.date,
        appointment.time,
        appointment.doctor?.fullname || '',
        appointment.doctor?.specialization || '',
        appointment.status,
        appointment.note || '',
      ]),
      [],
      ['Medical Records'],
      ['Visit Date', 'Doctor', 'Diagnosis', 'Prescription', 'Note'],
      ...records.map((record) => [
        record.visitDate,
        record.appointment?.doctor?.fullname || '',
        record.diagnosis || '',
        record.prescription || '',
        record.note || '',
      ]),
    ];
    downloadCsv(`dhams-patient-report-${patientId}.csv`, rows);
  }

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Reports</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            Your care summary, insurance status, and recent clinical activity.
          </p>
        </div>
        <button onClick={exportReport} disabled={loading || !!error}
          className="flex items-center justify-center gap-2 text-sm font-semibold rounded-lg px-4 border disabled:opacity-50 self-start"
          style={{ height: 40, borderColor: 'var(--color-border)', color: 'var(--color-text)', background: 'var(--color-surface)' }}>
          <Icon id="file-text" size={15} />
          Export CSV
        </button>
      </div>

      {error && <Card><p className="text-sm" style={{ color: 'var(--color-error)' }}>{error}</p></Card>}
      {loading ? <Card><p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading reports...</p></Card> : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Stat label="Appointments" value={appointments.length} icon="calendar" />
            <Stat label="Upcoming" value={report.upcoming} icon="clock" tone="info" />
            <Stat label="Medical Records" value={records.length} icon="file-text" tone="success" />
            <Stat label="Completed Visits" value={report.byStatus.COMPLETED} icon="check-circle" tone="warning" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--color-text)' }}>Appointment Outcomes</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {STATUS.map((status) => (
                  <div key={status} className="rounded-lg p-3" style={{ background: 'var(--color-bg-subtle)' }}>
                    <p className="text-lg font-bold" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-mono)' }}>{report.byStatus[status]}</p>
                    <p className="text-xs capitalize" style={{ color: 'var(--color-text-muted)' }}>{status.toLowerCase()}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Icon id="shield" size={17} color="var(--color-primary-600)" />
                <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>Insurance</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p style={{ color: 'var(--color-text)' }}>{profile?.insuranceProvider || 'No provider added'}</p>
                <p style={{ color: 'var(--color-text-muted)' }}>{profile?.insuranceCoverageType || 'Coverage type not set'}</p>
                <p style={{ color: 'var(--color-text-subtle)' }}>Member: {profile?.insuranceMemberNumber || 'Not set'}</p>
                <p style={{ color: 'var(--color-text-subtle)' }}>Expires: {formatDate(profile?.insuranceExpiryDate)}</p>
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--color-text)' }}>Recent Medical Records</h3>
            {records.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No records yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {records.slice(0, 4).map((record) => (
                  <div key={record.recordId} className="rounded-lg p-3" style={{ background: 'var(--color-bg-subtle)' }}>
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{record.diagnosis}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{record.appointment?.doctor?.fullname || 'Doctor'} - {formatDate(record.visitDate)}</p>
                    <p className="text-xs mt-2 line-clamp-2" style={{ color: 'var(--color-text-subtle)' }}>{record.note || record.prescription}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
