import Icon from '../../components/Icon';

/**
 * variant="light"  — white bg + primary-600 icon + dark text  (scrolled nav, footer)
 * variant="dark"   — white/translucent bg + white icon + white text  (hero / dark bg)
 */
export default function Logo({ variant = 'light', size = 'md' }) {
  const isLight = variant === 'light';
  const textSize = size === 'sm' ? 'text-sm' : 'text-base';
  const boxSize  = size === 'sm' ? 'w-7 h-7'  : 'w-9 h-9';
  const iconSize = size === 'sm' ? 13 : 18;

  return (
    <div className="flex items-center gap-2">
      <span
        className={`${boxSize} rounded-xl flex items-center justify-center shrink-0`}
        style={{
          backgroundColor: isLight ? 'var(--color-primary-50)' : 'rgba(255,255,255,0.15)',
          color: isLight ? 'var(--color-primary-600)' : '#fff',
        }}
      >
        <Icon id="stethoscope" size={iconSize} />
      </span>
      <span
        className={`font-bold tracking-tight ${textSize}`}
        style={{ color: isLight ? 'var(--color-text)' : '#fff' }}
      >
        DHAMS
      </span>
    </div>
  );
}
