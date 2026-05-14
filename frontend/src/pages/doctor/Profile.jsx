import { useEffect, useState } from 'react';
import Icon from '../../components/Icon';
import api from '../../api/axios';

const EMPTY_FORM = {
  fullname: '',
  email: '',
  phone: '',
  specialization: '',
  qualification: '',
};

const EMPTY_PWD = { current: '', next: '', confirm: '' };

const inputBase = {
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

function ReadInput({ icon, value }) {
  return (
    <div className="relative flex items-center">
      {icon && <span className="absolute left-3 pointer-events-none" style={{ color: 'var(--color-text-subtle)' }}><Icon id={icon} size={15} /></span>}
      <input readOnly value={value || ''}
        className={`w-full text-sm rounded-lg border outline-none cursor-default ${icon ? 'pl-9 pr-3' : 'px-3'}`}
        style={inputBase} />
    </div>
  );
}

function EditInput({ icon, name, type = 'text', value, onChange }) {
  return (
    <div className="relative flex items-center">
      {icon && <span className="absolute left-3 pointer-events-none" style={{ color: 'var(--color-text-subtle)' }}><Icon id={icon} size={15} /></span>}
      <input type={type} name={name} value={value || ''} onChange={onChange}
        className={`w-full text-sm rounded-lg border outline-none ${icon ? 'pl-9 pr-3' : 'px-3'}`}
        style={inputBase} />
    </div>
  );
}

export default function DoctorProfile() {
  const doctorId = localStorage.getItem('userId');
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [pwd,     setPwd]     = useState(EMPTY_PWD);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');
  const [pwdErr,  setPwdErr]  = useState('');

  useEffect(() => {
    if (!doctorId) { setLoading(false); return; }
    api.get(`/doctors/${doctorId}`)
      .then(({ data }) => {
        setForm({
          fullname:       data.fullname       || '',
          email:          data.email          || '',
          phone:          data.phone          || '',
          specialization: data.specialization || '',
          qualification:  data.qualification  || '',
        });
        localStorage.setItem('name',     data.fullname || '');
        localStorage.setItem('fullName', data.fullname || '');
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, [doctorId]);

  const set   = e => setForm({ ...form, [e.target.name]: e.target.value });
  const setPw = e => setPwd({ ...pwd,  [e.target.name]: e.target.value });

  async function handleSave() {
    if (pwd.next || pwd.current || pwd.confirm) {
      if (!pwd.current)             return setPwdErr('Enter your current password.');
      if (pwd.next.length < 6)      return setPwdErr('New password must be at least 6 characters.');
      if (pwd.next !== pwd.confirm) return setPwdErr('Passwords do not match.');
    }
    setPwdErr('');
    setSaving(true);
    setError('');
    try {
      const { data } = await api.put(`/doctors/${doctorId}`, {
        fullName:       form.fullname,
        phone:          form.phone,
        specialization: form.specialization,
        qualification:  form.qualification,
      });
      setForm(f => ({ ...f, fullname: data.fullname || f.fullname }));
      localStorage.setItem('name',     data.fullname || form.fullname);
      localStorage.setItem('fullName', data.fullname || form.fullname);
      setEditing(false);
      setPwd(EMPTY_PWD);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setPwd(EMPTY_PWD);
    setPwdErr('');
    setEditing(false);
    setError('');
  }

  return (
    <div className="flex flex-col gap-5 md:gap-6 w-full" style={{ maxWidth: 700 }}>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Profile</h2>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Manage your professional information.</p>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-2 text-sm font-semibold rounded-lg px-4 border self-start sm:self-auto"
            style={{ height: 40, borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
            <Icon id="edit" size={15} />Edit Profile
          </button>
        ) : (
          <div className="flex gap-2 self-start sm:self-auto">
            <button onClick={handleCancel}
              className="text-sm font-semibold rounded-lg px-4 border"
              style={{ height: 40, borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="text-sm font-semibold rounded-lg px-4 text-white disabled:opacity-50"
              style={{ height: 40, background: 'var(--color-primary-600)' }}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        )}
      </div>

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium"
          style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)', border: '1px solid var(--color-primary-200)' }}>
          <Icon id="check-circle" size={16} />Profile updated successfully.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium"
          style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)', border: '1px solid #fecaca' }}>
          <Icon id="alert-circle" size={16} />{error}
        </div>
      )}

      {/* Avatar card */}
      <div className="flex items-center gap-4 p-4 md:p-5 rounded-xl"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="rounded-full flex items-center justify-center text-white font-bold text-2xl shrink-0"
          style={{ width: 64, height: 64, background: 'var(--color-primary-600)' }}>
          {(form.fullname || 'D').charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-base md:text-lg truncate" style={{ color: 'var(--color-text)' }}>{form.fullname}</p>
          <p className="text-sm truncate" style={{ color: 'var(--color-text-muted)' }}>{form.specialization || 'Doctor'}</p>
          <span className="inline-block mt-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)' }}>
            Doctor
          </span>
        </div>
      </div>

      {/* Professional info */}
      <div className="rounded-xl p-4 md:p-6 flex flex-col gap-4 md:gap-5"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>Professional Information</p>

        {loading ? (
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                {editing ? <EditInput icon="user" name="fullname" value={form.fullname} onChange={set} />
                         : <ReadInput icon="user" value={form.fullname} />}
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
                <Label>Specialization</Label>
                {editing ? <EditInput icon="stethoscope" name="specialization" value={form.specialization} onChange={set} />
                         : <ReadInput icon="stethoscope" value={form.specialization} />}
              </div>
              <div>
                <Label>Qualification</Label>
                {editing ? <EditInput icon="award" name="qualification" value={form.qualification} onChange={set} />
                         : <ReadInput icon="award" value={form.qualification} />}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Change password */}
      <div className="rounded-xl p-4 md:p-6 flex flex-col gap-4"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>Change Password</p>

        {!editing && (
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Click "Edit Profile" to update your password.
          </p>
        )}

        {editing && (
          <>
            {pwdErr && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                style={{ background: 'var(--color-error-bg)', color: 'var(--color-error)', border: '1px solid #fecaca' }}>
                <Icon id="alert-circle" size={15} />{pwdErr}
              </div>
            )}
            <div>
              <Label>Current Password</Label>
              <EditInput icon="lock" name="current" type="password" value={pwd.current} onChange={setPw} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>New Password</Label>
                <EditInput icon="lock" name="next" type="password" value={pwd.next} onChange={setPw} />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <EditInput icon="lock" name="confirm" type="password" value={pwd.confirm} onChange={setPw} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
