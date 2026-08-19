export default function Crest({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 44" className={className} role="img" aria-label="Meramec Kindergarten Purple Team crest">
      <path
        d="M20 1 L38 7 V21 C38 32 30 40 20 43 C10 40 2 32 2 21 V7 Z"
        fill="var(--color-navy-900)"
        stroke="var(--color-orange-600)"
        strokeWidth="2"
      />
      <path d="M20 5 L34 9.5 V21 C34 30 27.5 36.5 20 39 C12.5 36.5 6 30 6 21 V9.5 Z" fill="var(--color-navy-700)" />
      <text
        x="20"
        y="27"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="20"
        fill="var(--color-orange-600)"
      >
        M
      </text>
    </svg>
  );
}
