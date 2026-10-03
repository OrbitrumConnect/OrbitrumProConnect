const C = {
  cyan: '#00BFFF', blue: '#00AEEF', ink: '#F4FAFF',
  border: 'rgba(0,174,255,0.18)',
};

interface ReasonChipProps {
  label: string;
  size?: 'sm' | 'md';
}

export function ReasonChip({ label, size = 'sm' }: ReasonChipProps) {
  const isMd = size === 'md';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: isMd ? 12 : 11, color: C.ink,
      background: `${C.blue}14`, border: `1px solid ${C.border}`,
      borderRadius: isMd ? 12 : 11, padding: isMd ? '3px 10px' : '2px 8px',
    }}>
      <span style={{ color: C.cyan }}>✓</span>{label}
    </span>
  );
}
