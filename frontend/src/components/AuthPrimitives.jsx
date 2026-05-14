import Icon from './Icon';

export function AuthLogo() {
  return (
    <div className="flex items-center gap-2 mb-7">
      <span
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-600)' }}
      >
        <Icon id="stethoscope" size={18} />
      </span>
      <span className="font-bold text-base tracking-tight" style={{ color: 'var(--color-text)' }}>DHAMS</span>
    </div>
  );
}

export function Field({ label, icon, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" style={{ color: 'var(--color-text-subtle)' }}>
            <Icon id={icon} size={15} />
          </span>
        )}
        {children}
      </div>
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div
      className="flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg mb-5"
      style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)' }}
    >
      <Icon id="alert-circle" size={15} />
      {message}
    </div>
  );
}
