const FIELDS = [
  { id: "3", cx: 210, cy: 78, rx: 78, ry: 46, label: "Field 3" },
  { id: "5", cx: 96, cy: 200, rx: 72, ry: 50, label: "Field 5" },
  { id: "5B", cx: 246, cy: 208, rx: 68, ry: 46, label: "Field 5B" },
] as const;

export default function ShawParkMap({ activeField }: { activeField: "3" | "5" | "5B" }) {
  const active = FIELDS.find((f) => f.id === activeField)!;

  return (
    <svg viewBox="0 0 340 280" className="w-full h-auto" role="img" aria-label={`Map of Shaw Park highlighting ${active.label}`}>
      <rect x="0" y="0" width="340" height="280" rx="18" fill="var(--color-navy-50)" />
      {/* park boundary */}
      <rect x="14" y="14" width="312" height="252" rx="14" fill="#e9f2e6" stroke="var(--color-navy-100)" strokeWidth="2" />

      {/* entrance road */}
      <path d="M0 236 H30 Q46 236 46 220 V60" fill="none" stroke="#d8d3c4" strokeWidth="14" strokeLinecap="round" />
      <path d="M0 236 H30 Q46 236 46 220 V60" fill="none" stroke="#efece2" strokeWidth="2" strokeDasharray="6 6" />

      {/* parking */}
      <rect x="20" y="238" width="58" height="26" rx="4" fill="#d8d3c4" />
      <text x="49" y="255" textAnchor="middle" fontSize="8" fontFamily="var(--font-body)" fill="#6b6455" fontWeight="700">
        PARKING
      </text>

      {/* fields */}
      {FIELDS.map((f) => {
        const isActive = f.id === activeField;
        return (
          <g key={f.id}>
            <ellipse
              cx={f.cx}
              cy={f.cy}
              rx={f.rx}
              ry={f.ry}
              fill={isActive ? "var(--color-orange-100)" : "#cdebc4"}
              stroke={isActive ? "var(--color-orange-600)" : "#9fd190"}
              strokeWidth={isActive ? 3 : 1.5}
            />
            <line x1={f.cx - f.rx + 8} y1={f.cy} x2={f.cx + f.rx - 8} y2={f.cy} stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />
            <text
              x={f.cx}
              y={f.cy + 5}
              textAnchor="middle"
              fontSize="15"
              fontFamily="var(--font-display)"
              fill={isActive ? "var(--color-orange-700)" : "#3f6b38"}
            >
              {f.label}
            </text>
          </g>
        );
      })}

      {/* pin on active field */}
      <g transform={`translate(${active.cx}, ${active.cy - active.ry - 6})`}>
        <circle r="9" fill="var(--color-navy-900)">
          <animate attributeName="r" values="9;11;9" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <path d="M0 9 L-7 -3 A7 7 0 1 1 7 -3 Z" fill="var(--color-navy-900)" />
        <circle r="3" fill="var(--color-orange-600)" />
      </g>

      {/* compass */}
      <g transform="translate(300, 34)">
        <circle r="16" fill="#ffffff" stroke="var(--color-navy-100)" strokeWidth="1.5" />
        <path d="M0 -10 L3 0 L0 10 L-3 0 Z" fill="var(--color-navy-700)" />
        <text y="-20" textAnchor="middle" fontSize="9" fontFamily="var(--font-body)" fontWeight="700" fill="var(--color-navy-700)">
          N
        </text>
      </g>

      <text x="26" y="30" fontSize="11" fontFamily="var(--font-body)" fontWeight="700" letterSpacing="0.04em" fill="var(--color-navy-700)">
        SHAW PARK · CLAYTON, MO
      </text>
    </svg>
  );
}
