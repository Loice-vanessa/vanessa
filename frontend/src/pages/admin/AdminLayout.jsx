import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';

const NAV = [
  { to: '/admin/dashboard',    icon: 'grid',        label: 'Dashboard' },
  { to: '/admin/doctors',      icon: 'stethoscope', label: 'Doctors' },
  { to: '/admin/patients',     icon: 'users',       label: 'Patients' },
  { to: '/admin/appointments', icon: 'calendar',    label: 'Appointments' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const name = localStorage.getItem('name') || localStorage.getItem('fullName') || 'Admin';

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
            <p className="text-green-300/60 text-xs">Administrator</p>
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

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col shrink-0"
        style={{ width: 'var(--sidebar-w)', background: 'var(--color-sidebar-bg)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)}
          style={{ background: 'rgba(0,0,0,0.5)' }}>
          <aside className="flex flex-col h-full w-64" style={{ background: 'var(--color-sidebar-bg)' }}
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
              Admin Portal
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0"
              style={{ width: 32, height: 32, background: 'var(--color-primary-600)' }}>
              {name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium" style={{ color: 'var(--color-text)' }}>{name}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden shrink-0 flex border-t"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors"
              style={({ isActive }) => ({ color: isActive ? 'var(--color-primary-600)' : 'var(--color-text-subtle)' })}>
              <Icon id={icon} size={20} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
