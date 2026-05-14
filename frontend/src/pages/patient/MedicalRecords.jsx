import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import Icon from '../../components/Icon';

function DetailModal({ record, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full sm:max-w-lg sm:mx-4 rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 flex flex-col gap-3"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base" style={{ color: 'var(--color-text)' }}>Record Details</h3>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}><Icon id="x" size={18} /></button>
        </div>
        {[
          { label: 'Diagnosis', value: record.diagnosis },
          { label: 'Doctor', value: `${record.appointment?.doctor?.fullname || 'Doctor'} — ${record.appointment?.doctor?.specialization || 'Specialist'}` },
          { label: 'Visit Date', value: record.visitDate },
          { label: 'Prescription', value: record.prescription },
          { label: "Doctor's Note", value: record.note },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg p-3"
            style={{ background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
            <p className="text-sm" style={{ color: 'var(--color-text)' }}>{value || 'N/A'}</p>
          </div>
        ))}
        <button onClick={onClose}
          className="w-full mt-1 text-sm font-semibold rounded-lg text-white"
          style={{ height: 40, background: 'var(--color-primary-600)' }}>
          Close
        </button>
      </div>
    </div>
  );
}

export default function MedicalRecords() {
  const patientId = localStorage.getItem('userId');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
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
        const { data } = await api.get(`/patients/${patientId}/records`);
        if (!ignore) setRecords(data || []);
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || 'Failed to load medical records.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => { ignore = true; };
  }, [patientId]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return records.filter((record) => {
      const doctor = record.appointment?.doctor?.fullname || '';
      return (
        record.diagnosis?.toLowerCase().includes(q) ||
        doctor.toLowerCase().includes(q) ||
        record.prescription?.toLowerCase().includes(q)
      );
    });
  }, [records, search]);

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Medical Records</h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Your complete health history in one place.</p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg text-sm"
          style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      <div className="relative w-full md:max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--color-text-subtle)' }}>
          <Icon id="search" size={16} />
        </span>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by diagnosis or doctor..."
          className="w-full pl-9 pr-3 text-sm rounded-lg border outline-none"
          style={{ height: 40, borderColor: 'var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)' }} />
      </div>

      {loading ? (
        <div className="rounded-xl p-6" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          Loading medical records...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-xl" style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <Icon id="file-text" size={40} color="var(--color-border-strong)" />
          <p className="mt-3 text-sm">No records match your search.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block rounded-xl overflow-hidden"
            style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-subtle)' }}>
                  {['Diagnosis', 'Doctor', 'Date', 'Prescription', ''].map((heading) => (
                    <th key={heading} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                      style={{ color: 'var(--color-text-muted)' }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((record, index) => (
                  <tr key={record.recordId}
                    style={{ borderBottom: index < filtered.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                    <td className="px-5 py-3 font-medium" style={{ color: 'var(--color-text)' }}>{record.diagnosis}</td>
                    <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>
                      <div>{record.appointment?.doctor?.fullname || 'Doctor'}</div>
                      <div className="text-xs" style={{ color: 'var(--color-text-subtle)' }}>
                        {record.appointment?.doctor?.specialization || 'Specialist'}
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap" style={{ color: 'var(--color-text-muted)' }}>
                      {record.visitDate}
                    </td>
                    <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>
                      {record.prescription}
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => setSelected(record)}
                        className="text-xs font-semibold px-3 py-1 rounded-lg whitespace-nowrap"
                        style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-3">
            {filtered.map((record) => (
              <div key={record.recordId} className="rounded-xl p-4"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{record.diagnosis}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                      {record.appointment?.doctor?.fullname || 'Doctor'} · {record.appointment?.doctor?.specialization || 'Specialist'}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{record.visitDate}</p>
                  </div>
                  <button onClick={() => setSelected(record)}
                    className="text-xs font-semibold px-3 py-1 rounded-lg shrink-0"
                    style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}>
                    View
                  </button>
                </div>
                <p className="text-xs mt-2 pt-2" style={{ color: 'var(--color-text-subtle)', borderTop: '1px solid var(--color-border)' }}>
                  {record.prescription}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {selected && <DetailModal record={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
