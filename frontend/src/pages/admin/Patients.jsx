import { useEffect, useState } from 'react';
import Icon from '../../components/Icon';
import api from '../../api/axios';

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get('/patients').then(r => setPatients(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Patients</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{patients.length} registered patients</p>
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
      ) : patients.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <Icon id="users" size={36} color="var(--color-border-strong)" />
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>No patients found.</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block rounded-xl overflow-hidden"
            style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-subtle)' }}>
                  {['Patient', 'Gender', 'Date of Birth', 'Blood Group', 'Phone'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide"
                      style={{ color: 'var(--color-text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patients.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < patients.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-xs"
                          style={{ width: 32, height: 32, background: 'var(--color-info)' }}>
                          {p.fullname?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--color-text)' }}>{p.fullname}</p>
                          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{p.gender ?? '—'}</td>
                    <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{p.dateOfBirth ?? '—'}</td>
                    <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{p.bloodGroup ?? '—'}</td>
                    <td className="px-5 py-3" style={{ color: 'var(--color-text-muted)' }}>{p.phone ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-3">
            {patients.map(p => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl p-3"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div className="rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-sm"
                  style={{ width: 40, height: 40, background: 'var(--color-info)' }}>
                  {p.fullname?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>{p.fullname}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{p.gender ?? '—'} · {p.bloodGroup ?? '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
