import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';

const NAV = [
  { to: '/patient/dashboard', icon: 'grid', label: 'Dashboard' },
  { to: '/patient/appointments', icon: 'calendar', label: 'Appointments' },
  { to: '/patient/records', icon: 'file-text', label: 'Records' },
  { to: '/patient/reports', icon: 'activity', label: 'Reports' },
  { to: '/patient/profile', icon: 'user', label: 'Profile' },
];

export default function PatientLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const name = localStorage.getItem('name') || localStorage.getItem('fullName') || 'Patient';
  const patientId = localStorage.getItem('userId');

  useEffect(() => {
    if (!patientId) {
      navigate('/login', { replace: true });
    }
  }, [navigate, patientId]);

  if (!patientId) {
    return null;
  }

  function logout() {
    localStorage.clear();
    navigate('/login');
  }

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10 shrink-0">
        <div className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 32, height: 32, background: 'var(--color-primary-600)' }}>
          <Icon id="stethoscope" size={18} color="#fff" />
        </div>
        <span className="font-bold text-white text-base tracking-tight">DHAMS</span>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'text-white bg-white/10' : 'text-green-300/70 hover:text-white hover:bg-white/5'
              }`
            }
            style={{ height: 'var(--nav-item-h)' }}>
            <Icon id={icon} size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-sm"
            style={{ width: 36, height: 36, background: 'var(--color-primary-600)' }}>
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-medium truncate">{name}</p>
            <p className="text-green-300/60 text-xs truncate">Patient</p>
          </div>
        </div>
        <button onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-white/10 transition-colors">
          <Icon id="log-out" size={16} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      <aside className="hidden md:flex flex-col shrink-0"
        style={{ width: 'var(--sidebar-w)', background: 'var(--color-sidebar-bg)' }}>
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)}
          style={{ background: 'rgba(0,0,0,0.5)' }}>
          <aside className="flex flex-col h-full w-64"
            style={{ background: 'var(--color-sidebar-bg)' }}
            onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="shrink-0 flex items-center justify-between border-b px-4 md:px-8"
          style={{ height: 'var(--nav-top-h)', background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1 rounded-lg" onClick={() => setSidebarOpen(true)}
              style={{ color: 'var(--color-text-muted)' }}>
              <Icon id="menu" size={22} />
            </button>
            <span className="font-semibold text-sm md:text-base" style={{ color: 'var(--color-text)' }}>
              Patient Portal
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
              style={{ width: 32, height: 32, background: 'var(--color-primary-600)' }}>
              {name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              {name}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
