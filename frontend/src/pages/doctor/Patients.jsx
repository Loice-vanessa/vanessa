import { useEffect, useState } from 'react';
import Icon from '../../components/Icon';
import api from '../../api/axios';

function RecordsDrawer({ patient, onClose }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/patients/${patient.id}/records`)
      .then(r => setRecords(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [patient.id]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}>
      <div className="h-full w-full max-w-md flex flex-col overflow-hidden"
        style={{ background: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="rounded-full flex items-center justify-center shrink-0 text-white font-semibold"
              style={{ width: 40, height: 40, background: 'var(--color-primary-600)' }}>
              {patient.fullname?.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{patient.fullname}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{patient.phone ?? '—'}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--color-text-muted)' }}><Icon id="x" size={18} /></button>
        </div>

        {/* Patient details */}
        <div className="px-5 py-4 border-b shrink-0" style={{ borderColor: 'var(--color-border)' }}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Gender',      value: patient.gender      ?? '—' },
              { label: 'Blood Group', value: patient.bloodGroup  ?? '—' },
              { label: 'Phone',       value: patient.phone       ?? '—' },
              { label: 'DOB',         value: patient.dateOfBirth ?? '—' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg p-2.5"
                style={{ background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
                <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--color-text)' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Records */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>Medical Records</p>
          {loading && <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>}
          {!loading && records.length === 0 && (
            <div className="text-center py-10" style={{ color: 'var(--color-text-muted)' }}>
              <Icon id="file-text" size={32} color="var(--color-border-strong)" />
              <p className="mt-2 text-sm">No records yet.</p>
            </div>
          )}
          {records.map(r => (
            <div key={r.recordId} className="rounded-xl p-4 flex flex-col gap-2"
              style={{ background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{r.diagnosis}</p>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{r.visitDate}</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <span className="font-medium">Rx:</span> {r.prescription}
              </p>
              {r.note && (
                <p className="text-xs italic" style={{ color: 'var(--color-text-subtle)' }}>{r.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Patients() {
  const doctorId = localStorage.getItem('userId');
  const [patients, setPatients] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!doctorId) return;
    api.get(`/doctors/${doctorId}/patients`)
      .then(r => setPatients(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [doctorId]);

  const filtered = patients.filter(p =>
    p.fullname?.toLowerCase().includes(search.toLowerCase()) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Patients</h2>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          All patients who have booked appointments with you.
        </p>
      </div>

      {/* Search */}
      <div className="relative w-full md:max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--color-text-subtle)' }}>
          <Icon id="search" size={16} />
        </span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full pl-9 pr-3 text-sm rounded-lg border outline-none"
          style={{ height: 40, borderColor: 'var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)' }} />
      </div>

      {loading && <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>}

      {/* Desktop table */}
      {!loading && filtered.length > 0 && (
        <div className="hidden md:block rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-subtle)' }}>
                {['Patient', 'Gender', 'Blood Group', 'Phone', ''].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                    style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-xs"
                        style={{ width: 34, height: 34, background: 'var(--color-primary-600)' }}>
                        {p.fullname?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: 'var(--color-text)' }}>{p.fullname}</p>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{p.phone ?? '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{p.gender ?? '—'}</td>
                  <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{p.bloodGroup ?? '—'}</td>
                  <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{p.phone ?? '—'}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => setSelected(p)}
                      className="text-xs font-semibold px-3 py-1 rounded-lg"
                      style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}>
                      View Records
                    </button>
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
          {filtered.map(p => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl p-3"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <div className="rounded-full flex items-center justify-center shrink-0 text-white font-semibold"
                style={{ width: 42, height: 42, background: 'var(--color-primary-600)' }}>
                {p.fullname?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>{p.fullname}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{p.phone ?? '—'}</p>
              </div>
              <button onClick={() => setSelected(p)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0"
                style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}>
                Records
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--color-text-muted)' }}>
          <Icon id="users" size={40} color="var(--color-border-strong)" />
          <p className="mt-3 text-sm">No patients found.</p>
        </div>
      )}

      {selected && <RecordsDrawer patient={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
