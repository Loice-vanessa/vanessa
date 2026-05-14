export default function Icon({ id, size = 18, className = '' }) {
  return (
    <svg width={size} height={size} className={className} aria-hidden="true">
      <use href={`/icons.svg#icon-${id}`} />
    </svg>
  );
}
