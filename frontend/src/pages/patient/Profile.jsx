import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Icon from '../../components/Icon';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  gender: '',
  dateOfBirth: '',
  address: '',
  bloodGroup: '',
  insuranceProvider: '',
  insuranceMemberNumber: '',
  insuranceCoverageType: '',
  insuranceExpiryDate: '',
};

const RWANDA_INSURERS = [
  'RSSB Mutuelle de Sante',
  'RSSB RAMA',
  'MMI',
  'Radiant Insurance',
  'Britam Rwanda',
  'Sanlam Rwanda',
  'Prime Insurance',
  'None',
];

const inputBase = {
  height: 40,
  borderColor: 'var(--color-border)',
  background: 'var(--color-bg)',
  color: 'var(--color-text)',
};

function Label({ children }) {
  return (
    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
      style={{ color: 'var(--color-text-muted)' }}>
      {children}
    </label>
  );
}

function toDateInput(value) {
  return value ? String(value).slice(0, 10) : '';
}

function ReadInput({ icon, value }) {
  return (
    <div className="relative flex items-center">
      {icon && (
        <span className="absolute left-3 pointer-events-none" style={{ color: 'var(--color-text-subtle)' }}>
          <Icon id={icon} size={15} />
        </span>
      )}
      <input readOnly value={value || ''}
        className={`w-full text-sm rounded-lg border outline-none cursor-default ${icon ? 'pl-9 pr-3' : 'px-3'}`}
        style={inputBase} />
    </div>
  );
}

function EditInput({ icon, name, type = 'text', value, onChange }) {
  return (
    <div className="relative flex items-center">
      {icon && (
        <span className="absolute left-3 pointer-events-none" style={{ color: 'var(--color-text-subtle)' }}>
          <Icon id={icon} size={15} />
        </span>
      )}
      <input type={type} name={name} value={value} onChange={onChange}
        className={`w-full text-sm rounded-lg border outline-none ${icon ? 'pl-9 pr-3' : 'px-3'}`}
        style={inputBase} />
    </div>
  );
}

function EditSelect({ name, value, onChange, options }) {
  return (
    <select name={name} value={value} onChange={onChange}
      className="w-full px-3 text-sm rounded-lg border outline-none appearance-none"
      style={inputBase}>
      <option value="">Select</option>
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  );
}

export default function Profile() {
  const patientId = localStorage.getItem('userId');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const set = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  useEffect(() => {
    if (!patientId) {
      setError('No patient profile was found for this session.');
      setLoading(false);
      return;
    }

    let ignore = false;
    async function load() {
      try {
        const { data } = await api.get(`/patients/${patientId}`);
        if (ignore) return;
        setForm({
          fullName: data.fullname || '',
          email: data.email || '',
          phone: data.phone || '',
          gender: data.gender || '',
          dateOfBirth: toDateInput(data.dateOfBirth),
          address: data.address || '',
          bloodGroup: data.bloodGroup || '',
          insuranceProvider: data.insuranceProvider || '',
          insuranceMemberNumber: data.insuranceMemberNumber || '',
          insuranceCoverageType: data.insuranceCoverageType || '',
          insuranceExpiryDate: toDateInput(data.insuranceExpiryDate),
        });
        localStorage.setItem('fullName', data.fullname || '');
        localStorage.setItem('name', data.fullname || '');
      } catch (err) {
        if (!ignore) setError(err.response?.data?.message || 'Failed to load profile.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => { ignore = true; };
  }, [patientId]);

  async function handleSave() {
    setError('');
    try {
      const { data } = await api.put(`/patients/${patientId}`, {
        fullName: form.fullName,
        phone: form.phone,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth || null,
        address: form.address,
        bloodGroup: form.bloodGroup,
        insuranceProvider: form.insuranceProvider,
        insuranceMemberNumber: form.insuranceMemberNumber,
        insuranceCoverageType: form.insuranceCoverageType,
        insuranceExpiryDate: form.insuranceExpiryDate || null,
      });
      localStorage.setItem('fullName', data.fullname || form.fullName);
      localStorage.setItem('name', data.fullname || form.fullName);
      setForm({
        fullName: data.fullname || '',
        email: data.email || '',
        phone: data.phone || '',
        gender: data.gender || '',
        dateOfBirth: toDateInput(data.dateOfBirth),
        address: data.address || '',
        bloodGroup: data.bloodGroup || '',
        insuranceProvider: data.insuranceProvider || '',
        insuranceMemberNumber: data.insuranceMemberNumber || '',
        insuranceCoverageType: data.insuranceCoverageType || '',
        insuranceExpiryDate: toDateInput(data.insuranceExpiryDate),
      });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile.');
    }
  }

  function handleCancel() {
    setEditing(false);
    setError('');
  }

  return (
    <div className="flex flex-col gap-5 md:gap-6 w-full" style={{ maxWidth: 700 }}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Profile</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Manage your personal information.</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-2 text-sm font-semibold rounded-lg px-4 border self-start sm:self-auto"
            style={{ height: 40, borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
            <Icon id="edit" size={15} />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2 self-start sm:self-auto">
            <button onClick={handleCancel}
              className="text-sm font-semibold rounded-lg px-4 border"
              style={{ height: 40, borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
              Cancel
            </button>
            <button onClick={handleSave}
              className="text-sm font-semibold rounded-lg px-4 text-white"
              style={{ height: 40, background: 'var(--color-primary-600)' }}>
              Save changes
            </button>
          </div>
        )}
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium"
          style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)', border: '1px solid var(--color-primary-200)' }}>
          <Icon id="check-circle" size={16} />
          Profile updated successfully.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium"
          style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)', border: '1px solid #fecaca' }}>
          <Icon id="alert-circle" size={16} />
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 p-4 md:p-5 rounded-xl"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="rounded-full flex items-center justify-center text-white font-bold text-2xl shrink-0"
          style={{ width: 64, height: 64, background: 'var(--color-primary-600)' }}>
          {(form.fullName || 'P').charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-base md:text-lg truncate" style={{ color: 'var(--color-text)' }}>{form.fullName}</p>
          <p className="text-sm truncate" style={{ color: 'var(--color-text-muted)' }}>{form.phone || form.email}</p>
          <span className="inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}>
            Patient
          </span>
        </div>
      </div>

      <div className="rounded-xl p-4 md:p-6 flex flex-col gap-4 md:gap-5"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>Personal Information</p>

        {loading ? (
          <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading profile...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                {editing ? <EditInput icon="user" name="fullName" value={form.fullName} onChange={set} />
                  : <ReadInput icon="user" value={form.fullName} />}
              </div>
              <div>
                <Label>Phone</Label>
                {editing ? <EditInput icon="phone" name="phone" value={form.phone} onChange={set} />
                  : <ReadInput icon="phone" value={form.phone} />}
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <ReadInput icon="mail" value={form.email} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Gender</Label>
                {editing ? <EditSelect name="gender" value={form.gender} onChange={set} options={['Male', 'Female']} />
                  : <ReadInput value={form.gender} />}
              </div>
              <div>
                <Label>Blood Group</Label>
                {editing ? <EditSelect name="bloodGroup" value={form.bloodGroup} onChange={set} options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
                  : <ReadInput value={form.bloodGroup} />}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Date of Birth</Label>
                {editing
                  ? <EditInput icon="calendar" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={set} />
                  : <ReadInput icon="calendar" value={form.dateOfBirth ? new Date(form.dateOfBirth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''} />}
              </div>
              <div>
                <Label>Address</Label>
                {editing ? <EditInput icon="map-pin" name="address" value={form.address} onChange={set} />
                  : <ReadInput icon="map-pin" value={form.address} />}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="rounded-xl p-4 md:p-6 flex flex-col gap-4 md:gap-5"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-2">
          <Icon id="shield" size={17} color="var(--color-primary-600)" />
          <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>Insurance</p>
        </div>

        {loading ? (
          <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading insurance...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Provider</Label>
                {editing ? <EditSelect name="insuranceProvider" value={form.insuranceProvider} onChange={set} options={RWANDA_INSURERS} />
                  : <ReadInput icon="shield" value={form.insuranceProvider} />}
              </div>
              <div>
                <Label>Member Number</Label>
                {editing ? <EditInput name="insuranceMemberNumber" value={form.insuranceMemberNumber} onChange={set} />
                  : <ReadInput value={form.insuranceMemberNumber} />}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Coverage Type</Label>
                {editing ? <EditInput name="insuranceCoverageType" value={form.insuranceCoverageType} onChange={set} />
                  : <ReadInput value={form.insuranceCoverageType} />}
              </div>
              <div>
                <Label>Expiry Date</Label>
                {editing ? <EditInput icon="calendar" name="insuranceExpiryDate" type="date" value={form.insuranceExpiryDate} onChange={set} />
                  : <ReadInput icon="calendar" value={form.insuranceExpiryDate ? new Date(form.insuranceExpiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''} />}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
