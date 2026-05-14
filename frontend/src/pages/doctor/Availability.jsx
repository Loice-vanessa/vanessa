import { useCallback, useEffect, useState } from 'react';
import Icon from '../../components/Icon';
import api from '../../api/axios';

const fieldStyle = {
  height: 40,
  borderColor: 'var(--color-border)',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
};

function Label({ children }) {
  return (
    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
      style={{ color: 'var(--color-text-muted)' }}>{children}</label>
  );
}

export default function Availability() {
  const doctorId = localStorage.getItem('userId');
  const [slots,   setSlots]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState({ date: '', start: '', end: '' });
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  const load = useCallback(() => {
    if (!doctorId) return;
    api.get(`/doctors/${doctorId}/availability`)
      .then(r => setSlots(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [doctorId]);

  useEffect(() => { load(); }, [load]);

  const set = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleAdd() {
    if (!form.date || !form.start || !form.end) return setError('All fields are required.');
    if (form.start >= form.end) return setError('Start time must be before end time.');
    setError('');
    setSaving(true);
    try {
      await api.post(`/doctors/${doctorId}/availability`, form);
      setForm({ date: '', start: '', end: '' });
      load();
    } catch {
      setError('Failed to add slot. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slotId) {
    try {
      await api.delete(`/doctors/availability/${slotId}`);
      load();
    } catch {
      setError('Cannot delete a booked slot.');
    }
  }

  // Group slots by date
  const grouped = slots.reduce((acc, s) => {
    const d = s.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(s);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="flex flex-col gap-5 md:gap-6" style={{ maxWidth: 720 }}>
      <div>
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Availability</h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          Set the time slots when patients can book appointments.
        </p>
      </div>

      {/* Add slot form */}
      <div className="rounded-xl p-4 md:p-6 flex flex-col gap-4"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>Add New Slot</p>

        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
            style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)', border: '1px solid #fecaca' }}>
            <Icon id="alert-circle" size={15} />{error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>Date</Label>
            <input type="date" name="date" value={form.date} onChange={set}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 text-sm rounded-lg border outline-none"
              style={fieldStyle} />
          </div>
          <div>
            <Label>Start Time</Label>
            <input type="time" name="start" value={form.start} onChange={set}
              className="w-full px-3 text-sm rounded-lg border outline-none"
              style={fieldStyle} />
          </div>
          <div>
            <Label>End Time</Label>
            <input type="time" name="end" value={form.end} onChange={set}
              className="w-full px-3 text-sm rounded-lg border outline-none"
              style={fieldStyle} />
          </div>
        </div>

        <button onClick={handleAdd} disabled={saving}
          className="flex items-center justify-center gap-2 text-sm font-semibold rounded-lg text-white self-start px-5 disabled:opacity-50"
          style={{ height: 40, background: 'var(--color-primary-600)' }}>
          <Icon id="plus" size={16} color="#fff" />
          {saving ? 'Adding…' : 'Add Slot'}
        </button>
      </div>

      {/* Slots list */}
      <div className="flex flex-col gap-4">
        {loading && <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>}

        {!loading && slots.length === 0 && (
          <div className="text-center py-16 rounded-xl"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
            <Icon id="clock" size={40} color="var(--color-border-strong)" />
            <p className="mt-3 text-sm">No availability slots yet. Add one above.</p>
          </div>
        )}

        {sortedDates.map(date => (
          <div key={date}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2"
              style={{ color: 'var(--color-text-muted)' }}>
              {new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            <div className="flex flex-wrap gap-2">
              {grouped[date].map(slot => (
                <div key={slot.availabilityId}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
                  style={{
                    background: slot.available ? 'var(--color-success-bg)' : 'var(--color-bg-subtle)',
                    border: `1px solid ${slot.available ? 'var(--color-primary-200)' : 'var(--color-border)'}`,
                    color: slot.available ? 'var(--color-success)' : 'var(--color-text-muted)',
                  }}>
                  <Icon id="clock" size={14} />
                  {slot.startTime} – {slot.endTime}
                  {slot.available ? (
                    <button onClick={() => handleDelete(slot.availabilityId)}
                      className="ml-1 rounded hover:opacity-70 transition-opacity"
                      style={{ color: 'inherit' }}>
                      <Icon id="x" size={13} />
                    </button>
                  ) : (
                    <span className="ml-1 text-xs font-semibold px-1.5 py-0.5 rounded"
                      style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)' }}>
                      Booked
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
