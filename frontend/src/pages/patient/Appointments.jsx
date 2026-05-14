import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import Icon from '../../components/Icon';

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

function statusTone(status) {
  if (status === 'CONFIRMED') return { bg: 'var(--color-success-bg)', color: 'var(--color-success)', label: 'Confirmed' };
  if (status === 'CANCELLED') return { bg: 'var(--color-error-bg)', color: 'var(--color-error)', label: 'Cancelled' };
  if (status === 'COMPLETED') return { bg: 'var(--color-info-bg)', color: 'var(--color-info)', label: 'Completed' };
  return { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', label: 'Pending' };
}

function Label({ children }) {
  return (
    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
      {children}
    </label>
  );
}

function BookModal({ onClose, patientId, onBooked }) {
  const [doctors, setDoctors] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [availabilityId, setAvailabilityId] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    async function loadDoctors() {
      try {
        const { data } = await api.get('/doctors');
        if (!ignore) setDoctors(data || []);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || 'Failed to load doctors.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    loadDoctors();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    if (!doctorId) {
      setAvailability([]);
      setAvailabilityId('');
      return;
    }

    let ignore = false;
    async function loadAvailability() {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/doctors/${doctorId}/availability`);
        if (!ignore) setAvailability(data || []);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || 'Failed to load availability.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadAvailability();
    return () => { ignore = true; };
  }, [doctorId]);

  const selectedDoctor = useMemo(
    () => doctors.find((doctor) => String(doctor.id) === String(doctorId)),
    [doctors, doctorId]
  );

  const canBook = patientId && doctorId && availabilityId;

  const handleBook = async () => {
    setSaving(true);
    setError('');
    try {
      await api.post('/appointments/book', {
        patientId: Number(patientId),
        doctorId: Number(doctorId),
        availabilityId: Number(availabilityId),
        note,
      });
      onBooked?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="w-full sm:max-w-md sm:mx-4 flex flex-col gap-4 sm:rounded-2xl rounded-t-2xl p-5 sm:p-6"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', maxHeight: '92vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base" style={{ color: 'var(--color-text)' }}>Book Appointment</h3>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}><Icon id="x" size={18} /></button>
        </div>

        {error && (
          <div className="px-3 py-2 rounded-lg text-sm"
            style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <div>
          <Label>Doctor</Label>
          <select value={doctorId} onChange={(e) => { setDoctorId(e.target.value); setAvailabilityId(''); }}
            className="w-full px-3 text-sm rounded-lg border outline-none appearance-none"
            style={{ height: 40, borderColor: 'var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
            <option value="">Select a doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.fullname} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        {selectedDoctor && (
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5"
            style={{ background: 'var(--color-primary-50)', border: '1px solid var(--color-primary-200)' }}>
            <div className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: 36, height: 36, background: 'var(--color-primary-600)' }}>
              <Icon id="stethoscope" size={16} color="#fff" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-primary-800)' }}>{selectedDoctor.fullname}</p>
              <p className="text-xs" style={{ color: 'var(--color-primary-600)' }}>{selectedDoctor.specialization}</p>
            </div>
          </div>
        )}

        <div>
          <Label>Available Slot</Label>
          <select value={availabilityId} onChange={(e) => setAvailabilityId(e.target.value)}
            className="w-full px-3 text-sm rounded-lg border outline-none appearance-none"
            style={{ height: 40, borderColor: 'var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }}
            disabled={!doctorId || loading}>
            <option value="">{loading ? 'Loading slots...' : 'Select a slot'}</option>
            {availability.map((slot) => (
              <option key={slot.availabilityId} value={slot.availabilityId}>
                {slot.date} {slot.startTime} - {slot.endTime}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Note (optional)</Label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
            placeholder="Describe your symptoms or reason for visit..."
            className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)' }} />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 text-sm font-semibold rounded-lg border"
            style={{ height: 40, borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
            Cancel
          </button>
          <button onClick={handleBook} disabled={!canBook || saving}
            className="flex-1 text-sm font-semibold rounded-lg text-white disabled:opacity-50"
            style={{ height: 40, background: 'var(--color-primary-600)' }}>
            {saving ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Appointments() {
  const patientId = localStorage.getItem('userId');
  const [tab, setTab] = useState('All');
  const [modal, setModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAppointments = async () => {
    if (!patientId) {
      setError('No patient profile was found for this session.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/patients/${patientId}/appointments`);
      setAppointments(data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const filtered = appointments.filter((appointment) => {
    if (tab === 'All') return true;
    if (tab === 'Upcoming') return ['PENDING', 'CONFIRMED'].includes(appointment.status);
    if (tab === 'Completed') return appointment.status === 'COMPLETED';
    if (tab === 'Cancelled') return appointment.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Appointments</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Manage and track all your appointments.</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center justify-center gap-2 text-sm font-semibold rounded-lg px-4 text-white self-start sm:self-auto"
          style={{ height: 40, background: 'var(--color-primary-600)' }}>
          <Icon id="plus" size={16} color="#fff" />
          Book Appointment
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg text-sm"
          style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
        <div className="flex gap-1 p-1 rounded-xl w-fit"
          style={{ background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}>
          {TABS.map((value) => (
            <button key={value} onClick={() => setTab(value)}
              className="px-4 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
              style={{
                height: 34,
                background: tab === value ? 'var(--color-surface)' : 'transparent',
                color: tab === value ? 'var(--color-primary-600)' : 'var(--color-text-muted)',
                boxShadow: tab === value ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}>
              {value}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl p-6" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          Loading appointments...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-xl" style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <Icon id="calendar" size={40} color="var(--color-border-strong)" />
          <p className="mt-3 text-sm">No appointments found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((appointment) => {
            const tone = statusTone(appointment.status);
            return (
              <div key={appointment.appointmentId} className="flex items-start gap-3 md:gap-4 rounded-xl p-3 md:p-4"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div className="flex items-center justify-center rounded-xl shrink-0 mt-0.5"
                  style={{ width: 40, height: 40, background: 'var(--color-primary-50)' }}>
                  <Icon id="stethoscope" size={18} color="var(--color-primary-600)" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                      {appointment.doctor?.fullname || 'Doctor'}
                    </p>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                      style={{ background: tone.bg, color: tone.color }}>
                      {tone.label}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    {appointment.doctor?.specialization || 'Specialist'}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                    {appointment.date} · {appointment.time}
                  </p>
                  {appointment.note && (
                    <p className="text-xs mt-1 italic" style={{ color: 'var(--color-text-subtle)' }}>
                      {appointment.note}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && <BookModal onClose={() => setModal(false)} patientId={patientId} onBooked={loadAppointments} />}
    </div>
  );
}
