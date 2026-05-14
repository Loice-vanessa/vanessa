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

export default function DoctorReports() {
  const doctorId = localStorage.getItem('userId');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!doctorId) return;
    let ignore = false;
    async function load() {
      try {
        const [appointmentsRes, patientsRes] = await Promise.all([
          api.get(`/doctors/${doctorId}/schedule`),
          api.get(`/doctors/${doctorId}/patients`),
        ]);
        if (ignore) return;
        setAppointments(appointmentsRes.data || []);
        setPatients(patientsRes.data || []);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || 'Failed to load reports.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [doctorId]);

  const report = useMemo(() => {
    const byStatus = Object.fromEntries(STATUS.map((status) => [status, appointments.filter((a) => a.status === status).length]));
    const insured = patients.filter((p) => p.insuranceProvider && p.insuranceProvider !== 'None').length;
    const providers = patients.reduce((acc, patient) => {
      const provider = patient.insuranceProvider || 'Not recorded';
      acc[provider] = (acc[provider] || 0) + 1;
      return acc;
    }, {});
    const nextAppointments = appointments
      .filter((a) => ['PENDING', 'CONFIRMED'].includes(a.status))
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
      .slice(0, 5);
    return { byStatus, insured, providers, nextAppointments };
  }, [appointments, patients]);

  function exportReport() {
    const rows = [
      ['DHAMS Doctor Report'],
      ['Doctor ID', doctorId],
      ['Generated', new Date().toLocaleString('en-GB')],
      [],
      ['Summary'],
      ['Appointments', appointments.length],
      ['Patients', patients.length],
      ['Completed', report.byStatus.COMPLETED],
      ['Insured Patients', report.insured],
      [],
      ['Appointment Outcomes'],
      ['Pending', report.byStatus.PENDING],
      ['Confirmed', report.byStatus.CONFIRMED],
      ['Completed', report.byStatus.COMPLETED],
      ['Cancelled', report.byStatus.CANCELLED],
      [],
      ['Insurance Mix'],
      ['Provider', 'Patients'],
      ...Object.entries(report.providers),
      [],
      ['Appointments'],
      ['Date', 'Time', 'Patient', 'Phone', 'Insurance Provider', 'Status', 'Note'],
      ...appointments.map((appointment) => [
        appointment.date,
        appointment.time,
        appointment.patient?.fullname || '',
        appointment.patient?.phone || '',
        appointment.patient?.insuranceProvider || 'Not recorded',
        appointment.status,
        appointment.note || '',
      ]),
      [],
      ['Patients'],
      ['Name', 'Phone', 'Gender', 'Blood Group', 'Insurance Provider', 'Member Number'],
      ...patients.map((patient) => [
        patient.fullname || '',
        patient.phone || '',
        patient.gender || '',
        patient.bloodGroup || '',
        patient.insuranceProvider || 'Not recorded',
        patient.insuranceMemberNumber || '',
      ]),
    ];
    downloadCsv(`dhams-doctor-report-${doctorId}.csv`, rows);
  }

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Reports</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            Practice workload, appointment outcomes, and patient insurance coverage.
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
            <Stat label="Patients" value={patients.length} icon="users" tone="info" />
            <Stat label="Completed" value={report.byStatus.COMPLETED} icon="check-circle" tone="success" />
            <Stat label="Insured Patients" value={report.insured} icon="shield" tone="warning" />
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
                <h3 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>Insurance Mix</h3>
              </div>
              <div className="space-y-2">
                {Object.entries(report.providers).map(([provider, count]) => (
                  <div key={provider} className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate" style={{ color: 'var(--color-text-muted)' }}>{provider}</span>
                    <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--color-text)' }}>Upcoming Patient Worklist</h3>
            {report.nextAppointments.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No upcoming appointments.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.nextAppointments.map((appointment) => (
                  <div key={appointment.appointmentId} className="rounded-lg p-3" style={{ background: 'var(--color-bg-subtle)' }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>{appointment.patient?.fullname || 'Patient'}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{formatDate(appointment.date)} at {appointment.time}</p>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full shrink-0"
                        style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-xs mt-2" style={{ color: 'var(--color-text-subtle)' }}>
                      Insurance: {appointment.patient?.insuranceProvider || 'Not recorded'}
                    </p>
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
