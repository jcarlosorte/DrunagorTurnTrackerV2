import { getExpansionColor, getExpansionIcon } from '@/data/expansionIcons';

/**
 * Símbolo pequeño de la expansión. El `title` y el `aria-label` muestran su
 * nombre al pasar por encima.
 */
export default function ExpansionIcon({ expansionId, label, size = 'h-5 w-5', className = '' }) {
  const icon = getExpansionIcon(expansionId);
  if (!icon) return null;

  const color = getExpansionColor(expansionId);
  const name = label || expansionId;

  return (
    <span
      title={name}
      aria-label={name}
      data-expansion-icon={expansionId}
      className={`inline-flex shrink-0 items-center justify-center rounded-md border p-0.5 ${size} ${className}`}
      style={{ borderColor: `${color}cc`, backgroundColor: `${color}33` }}
    >
      <img src={icon} alt="" className="h-full w-full object-contain" loading="lazy" decoding="async" />
    </span>
  );
}
