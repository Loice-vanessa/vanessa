import { useCallback, useEffect, useState } from 'react';
import Icon from '../../components/Icon';
import api from '../../api/axios';

const TABS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

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

function RecordModal({ appointment, onClose, onSaved }) {
  const [form, setForm] = useState({ diagnosis: '', prescription: '', note: '' });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit() {
    if (!form.diagnosis.trim() || !form.prescription.trim()) {
      return setError('Diagnosis and prescription are required.');
    }
    setLoading(true);
    try {
      await api.post(`/appointments/${appointment.appointmentId}/record`, form);
      onSaved();
      onClose();
    } catch {
      setError('Failed to save record. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="w-full sm:max-w-lg sm:mx-4 rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', maxHeight: '90vh', overflowY: 'auto' }}>

        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base" style={{ color: 'var(--color-text)' }}>Write Medical Record</h3>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}><Icon id="x" size={18} /></button>
        </div>

        {/* Patient info */}
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5"
          style={{ background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}>
          <div className="rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-sm"
            style={{ width: 36, height: 36, background: 'var(--color-primary-600)' }}>
            {appointment.patient?.fullname?.charAt(0) ?? 'P'}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              {appointment.patient?.fullname}
            </p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {appointment.date} · {appointment.time}
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
            style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)', border: '1px solid #fecaca' }}>
            <Icon id="alert-circle" size={15} />{error}
          </div>
        )}

        {[
          { name: 'diagnosis',    label: 'Diagnosis',    rows: 2, placeholder: 'e.g. Hypertension Stage 1' },
          { name: 'prescription', label: 'Prescription', rows: 2, placeholder: 'e.g. Amlodipine 5mg once daily' },
          { name: 'note',         label: "Doctor's Note (optional)", rows: 3, placeholder: 'Additional observations or instructions…' },
        ].map(f => (
          <div key={f.name}>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
              {f.label}
            </label>
            <textarea name={f.name} value={form[f.name]} onChange={set} rows={f.rows}
              placeholder={f.placeholder}
              className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
          </div>
        ))}

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 text-sm font-semibold rounded-lg border"
            style={{ height: 40, borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 text-sm font-semibold rounded-lg text-white disabled:opacity-50"
            style={{ height: 40, background: 'var(--color-primary-600)' }}>
            {loading ? 'Saving…' : 'Save Record'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Schedule() {
  const doctorId = localStorage.getItem('userId');
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [tab,          setTab]          = useState('All');
  const [recordModal,  setRecordModal]  = useState(null);

  const load = useCallback(() => {
    if (!doctorId) return;
    api.get(`/doctors/${doctorId}/schedule`)
      .then(r => setAppointments(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [doctorId]);

  useEffect(() => { load(); }, [load]);

  async function handleConfirm(id) {
    await api.put(`/appointments/${id}/confirm`);
    load();
  }

  async function handleCancel(id) {
    await api.put(`/appointments/${id}/cancel`);
    load();
  }

  const filtered = appointments.filter(a => {
    if (tab === 'All') return true;
    return a.status === tab.toUpperCase();
  });

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Schedule</h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          Manage all your patient appointments.
        </p>
      </div>

      {/* Tabs */}
      <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
        <div className="flex gap-1 p-1 rounded-xl w-fit"
          style={{ background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
              style={{
                height: 34,
                background: tab === t ? 'var(--color-surface)' : 'transparent',
                color:      tab === t ? 'var(--color-primary-600)' : 'var(--color-text-muted)',
                boxShadow:  tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>}

      {/* Desktop table */}
      {!loading && filtered.length > 0 && (
        <div className="hidden md:block rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-subtle)' }}>
                {['Patient', 'Date', 'Time', 'Note', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt, i) => (
                <tr key={apt.appointmentId}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <td className="px-5 py-3">
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>{apt.patient?.fullname}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{apt.patient?.phone ?? '—'}</p>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>{apt.date}</td>
                  <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>{apt.time}</td>
                  <td className="px-5 py-3 max-w-xs">
                    <p className="truncate text-xs" style={{ color: 'var(--color-text-subtle)' }}>{apt.note || '—'}</p>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={apt.status} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {apt.status === 'PENDING' && (
                        <button onClick={() => handleConfirm(apt.appointmentId)}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                          style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                          Confirm
                        </button>
                      )}
                      {apt.status === 'CONFIRMED' && (
                        <button onClick={() => setRecordModal(apt)}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                          style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}>
                          Write Record
                        </button>
                      )}
                      {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                        <button onClick={() => handleCancel(apt.appointmentId)}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                          style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)' }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile cards */}
      {!loading && filtered.length > 0 && (
        <div className="md:hidden flex flex-col gap-3">
          {filtered.map(apt => (
            <div key={apt.appointmentId} className="rounded-xl p-4 flex flex-col gap-3"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>
                    {apt.patient?.fullname}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    {apt.date} · {apt.time}
                  </p>
                  {apt.note && (
                    <p className="text-xs mt-1 italic" style={{ color: 'var(--color-text-subtle)' }}>{apt.note}</p>
                  )}
                </div>
                <StatusBadge status={apt.status} />
              </div>
              {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                <div className="flex gap-2 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                  {apt.status === 'PENDING' && (
                    <button onClick={() => handleConfirm(apt.appointmentId)}
                      className="flex-1 text-xs font-semibold py-2 rounded-lg"
                      style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)' }}>
                      Confirm
                    </button>
                  )}
                  {apt.status === 'CONFIRMED' && (
                    <button onClick={() => setRecordModal(apt)}
                      className="flex-1 text-xs font-semibold py-2 rounded-lg"
                      style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}>
                      Write Record
                    </button>
                  )}
                  <button onClick={() => handleCancel(apt.appointmentId)}
                    className="flex-1 text-xs font-semibold py-2 rounded-lg"
                    style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)' }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--color-text-muted)' }}>
          <Icon id="calendar" size={40} color="var(--color-border-strong)" />
          <p className="mt-3 text-sm">No appointments found.</p>
        </div>
      )}

      {recordModal && (
        <RecordModal
          appointment={recordModal}
          onClose={() => setRecordModal(null)}
          onSaved={load}
        />
      )}
    </div>
  );
}
