type FieldId = "3" | "5" | "5B";

/** Soccer/multi-use fields — rectangular, green, with a center line. */
const RECT_FIELDS: { id: string; x: number; y: number; w: number; h: number; label: string; sub?: string }[] = [
  { id: "7", x: 55, y: 258, w: 108, h: 66, label: "7", sub: "Adzick" },
  { id: "6", x: 68, y: 332, w: 118, h: 86, label: "6" },
  { id: "6c", x: 148, y: 388, w: 30, h: 24, label: "6c" },
  { id: "6d", x: 143, y: 413, w: 35, h: 24, label: "6d" },
  { id: "5A", x: 210, y: 348, w: 52, h: 62, label: "5A" },
  { id: "5B", x: 234, y: 322, w: 54, h: 46, label: "5B" },
  { id: "5c", x: 260, y: 358, w: 34, h: 42, label: "5c" },
];

/** Baseball/softball diamonds. */
const DIAMOND_FIELDS: { id: string; cx: number; cy: number; r: number; label: string }[] = [
  { id: "3", cx: 348, cy: 250, r: 30, label: "3" },
  { id: "3a", cx: 350, cy: 300, r: 22, label: "3a" },
  { id: "1a", cx: 330, cy: 452, r: 24, label: "1a" },
  { id: "1b", cx: 340, cy: 492, r: 22, label: "1b" },
];

const HIGHLIGHT: Record<FieldId, { kind: "rect" | "diamond"; id: string }> = {
  "5": { kind: "rect", id: "5A" },
  "5B": { kind: "rect", id: "5B" },
  "3": { kind: "diamond", id: "3" },
};

export default function ShawParkMap({ activeField }: { activeField: FieldId }) {
  const highlight = HIGHLIGHT[activeField];
  const activeRect = highlight.kind === "rect" ? RECT_FIELDS.find((f) => f.id === highlight.id) : undefined;
  const activeDiamond = highlight.kind === "diamond" ? DIAMOND_FIELDS.find((f) => f.id === highlight.id) : undefined;
  const pinX = activeRect ? activeRect.x + activeRect.w / 2 : activeDiamond ? activeDiamond.cx : 0;
  const pinY = activeRect ? activeRect.y - 8 : activeDiamond ? activeDiamond.cy - activeDiamond.r - 8 : 0;

  return (
    <svg viewBox="0 0 480 620" className="w-full h-auto" role="img" aria-label="Charles A. Shaw Park map">
      <rect width="480" height="620" fill="#ffffff" />
      <text x="14" y="24" fontSize="17" fontFamily="var(--font-display, sans-serif)" fill="var(--color-navy-900)">
        Charles A. Shaw Park
      </text>

      {/* park green + roads */}
      <rect x="16" y="42" width="452" height="522" rx="10" fill="#e3e9e2" />
      <rect x="24" y="50" width="436" height="506" rx="8" fill="#dcece0" />

      {/* roads */}
      <g stroke="#37414a" strokeWidth="9" fill="none" strokeLinecap="round">
        <path d="M20 110 Q90 90 155 100 Q182 105 186 135 L188 260" />
        <path d="M300 90 Q322 150 335 220" />
        <path d="M335 105 Q400 150 458 205" />
        <path d="M150 175 Q195 168 205 205 Q210 232 175 238 Q145 234 150 195 Z" />
        <path d="M20 470 Q140 505 250 500 Q300 495 330 470" />
        <path d="M20 470 L20 560" />
        <path d="M458 95 L458 560" />
      </g>
      <g stroke="#f4f1e8" strokeWidth="1.5" strokeDasharray="7 7" fill="none" strokeLinecap="round" opacity="0.8">
        <path d="M20 110 Q90 90 155 100 Q182 105 186 135 L188 260" />
        <path d="M300 90 Q322 150 335 220" />
        <path d="M335 105 Q400 150 458 205" />
        <path d="M20 470 Q140 505 250 500 Q300 495 330 470" />
        <path d="M458 95 L458 560" />
      </g>
      <text x="24" y="102" fontSize="8" fill="#5b6672" fontWeight="700" transform="rotate(-14 24 102)">GAY AVE.</text>
      <text x="192" y="185" fontSize="7.5" fill="#5b6672" fontWeight="700" transform="rotate(78 192 185)">TOPTON WAY</text>
      <text x="290" y="150" fontSize="7.5" fill="#5b6672" fontWeight="700" transform="rotate(68 290 150)">PARKSIDE DR.</text>
      <text x="380" y="145" fontSize="7.5" fill="#5b6672" fontWeight="700" transform="rotate(30 380 145)">FORSYTH BLVD.</text>
      <text x="70" y="512" fontSize="7.5" fill="#5b6672" fontWeight="700">FOREST PARK PKWY</text>
      <text x="120" y="490" fontSize="7" fill="#5b6672" fontWeight="700">SHAW PARK DR.</text>
      <text x="463" y="330" fontSize="7.5" fill="#5b6672" fontWeight="700" transform="rotate(90 463 330)">S. BRENTWOOD BLVD.</text>

      {/* buildings */}
      <rect x="66" y="150" width="112" height="56" rx="4" fill="#aeb7c2" />
      <text x="72" y="172" fontSize="9" fontWeight="700" fill="var(--color-navy-600)">The Center</text>
      <text x="72" y="183" fontSize="9" fontWeight="700" fill="var(--color-navy-600)">of Clayton</text>
      <rect x="96" y="200" width="88" height="42" rx="4" fill="#cbb6ac" />
      <text x="100" y="224" fontSize="7.5" fontWeight="700" fill="var(--color-orange-700)">Clayton High School</text>
      <rect x="232" y="222" width="58" height="26" rx="3" fill="#c7cdd6" />
      <text x="235" y="234" fontSize="5.5" fontWeight="600" fill="#4a5361">School District</text>
      <text x="235" y="242" fontSize="5.5" fontWeight="600" fill="#4a5361">Admin</text>

      {/* parking */}
      {[
        [150, 100],
        [50, 178],
        [268, 258],
        [140, 468],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x}, ${y})`}>
          <circle r="9" fill="var(--color-navy-600)" />
          <text y="3.5" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">P</text>
        </g>
      ))}

      {/* pond + Chapman Plaza */}
      <ellipse cx="418" cy="148" rx="20" ry="14" fill="#a9cdE8" />
      <text x="392" y="128" fontSize="6.5" fontWeight="700" fill="#4a5361">Chapman Plaza</text>

      {/* Aquatic Center */}
      <rect x="382" y="228" width="66" height="92" rx="6" fill="#f1efe6" stroke="#c9c3b2" />
      <rect x="392" y="240" width="46" height="34" rx="4" fill="#8fc9e8" />
      <text x="386" y="288" fontSize="6.5" fontWeight="700" fill="#4a5361">Shaw Park</text>
      <text x="386" y="297" fontSize="6.5" fontWeight="700" fill="#4a5361">Aquatic Center</text>

      {/* Tennis Center */}
      <g>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={372 + i * 24} y="424" width="20" height="80" fill="#7fb7c9" stroke="#fff" strokeWidth="1" />
        ))}
      </g>
      <text x="368" y="512" fontSize="6.5" fontWeight="700" fill="#4a5361">Shaw Park Tennis Center</text>

      {/* misc amenity dots */}
      {[
        [292, 258, "Tree Top\nPlayground"],
        [316, 236, "N. Shelter"],
        [200, 258, "Volleyball\nCourts"],
        [252, 350, "Enterprise\nHoldings Pav."],
        [182, 398, "S. Shelter"],
        [216, 424, "Playground"],
      ].map(([x, y, label], i) => (
        <g key={i} transform={`translate(${x}, ${y})`}>
          <circle r="4" fill="#5b8f6b" />
          {String(label)
            .split("\n")
            .map((line, li) => (
              <text key={li} y={12 + li * 7} x="-16" fontSize="5.8" fontWeight="600" fill="#4a5361">
                {line}
              </text>
            ))}
        </g>
      ))}

      {/* picnic sites */}
      {[
        [268, 355],
        [292, 372],
        [270, 392],
        [300, 400],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#8a9b6f" />
      ))}

      {/* rectangular fields */}
      {RECT_FIELDS.map((f) => {
        const isActive = highlight.kind === "rect" && f.id === highlight.id;
        return (
          <g key={f.id}>
            <rect
              x={f.x}
              y={f.y}
              width={f.w}
              height={f.h}
              rx="3"
              fill={isActive ? "var(--color-orange-100)" : "#8fc07f"}
              stroke={isActive ? "var(--color-orange-600)" : "#5b8f4a"}
              strokeWidth={isActive ? 3 : 1.5}
            />
            <line
              x1={f.x + 6}
              y1={f.y + f.h / 2}
              x2={f.x + f.w - 6}
              y2={f.y + f.h / 2}
              stroke="#ffffff"
              strokeWidth="1.2"
              opacity="0.85"
            />
            {f.sub && (
              <text x={f.x + f.w / 2} y={f.y - 5} textAnchor="middle" fontSize="8" fontWeight="700" fill="#37414a">
                {f.sub}
              </text>
            )}
            <text
              x={f.x + f.w / 2}
              y={f.y + f.h / 2 + (f.w < 45 ? 3 : 5)}
              textAnchor="middle"
              fontSize={f.w < 45 ? 8 : 13}
              fontFamily="var(--font-display, sans-serif)"
              fill={isActive ? "var(--color-orange-700)" : "#1f3a1a"}
            >
              {f.label}
            </text>
          </g>
        );
      })}

      {/* diamond (baseball/softball) fields */}
      {DIAMOND_FIELDS.map((f) => {
        const isActive = highlight.kind === "diamond" && f.id === highlight.id;
        return (
          <g key={f.id} transform={`translate(${f.cx}, ${f.cy}) rotate(45)`}>
            <rect
              x={-f.r}
              y={-f.r}
              width={f.r * 2}
              height={f.r * 2}
              rx="4"
              fill={isActive ? "var(--color-orange-100)" : "#c9b98f"}
              stroke={isActive ? "var(--color-orange-600)" : "#8a7a52"}
              strokeWidth={isActive ? 3 : 1.5}
            />
            <text
              transform="rotate(-45)"
              textAnchor="middle"
              y={f.r < 25 ? 3 : 5}
              fontSize={f.r < 25 ? 8 : 12}
              fontFamily="var(--font-display, sans-serif)"
              fill={isActive ? "var(--color-orange-700)" : "#4a3f22"}
            >
              {f.label}
            </text>
          </g>
        );
      })}

      {/* pin on active field */}
      <g transform={`translate(${pinX}, ${pinY})`}>
        <circle r="9" fill="var(--color-navy-900)">
          <animate attributeName="r" values="9;11;9" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <path d="M0 9 L-7 -3 A7 7 0 1 1 7 -3 Z" fill="var(--color-navy-900)" />
        <circle r="3" fill="var(--color-orange-600)" />
      </g>

      {/* legend */}
      <g transform="translate(238, 68)">
        <rect width="196" height="66" rx="4" fill="#3a4249" opacity="0.92" />
        <g transform="translate(10, 14)">
          <rect x="-8" y="-8" width="16" height="16" rx="8" fill="#c9b98f" />
          <text y="4" textAnchor="middle" fontSize="7" fontWeight="700" fill="#3a3020">3</text>
        </g>
        <text x="24" y="18" fontSize="8" fontWeight="600" fill="#fff">Baseball / Softball Field</text>
        <g transform="translate(10, 34)">
          <circle r="8" fill="var(--color-navy-600)" />
          <text y="3" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff">P</text>
        </g>
        <text x="24" y="38" fontSize="8" fontWeight="600" fill="#fff">Parking</text>
        <g transform="translate(10, 54)">
          <circle r="6" fill="#e7ecf3" />
        </g>
        <text x="24" y="58" fontSize="8" fontWeight="600" fill="#fff">Restrooms (Apr 1–Oct 31)</text>
      </g>

      {/* compass */}
      <g transform="translate(432, 100)">
        <circle r="16" fill="#ffffff" stroke="var(--color-navy-100)" strokeWidth="1.5" />
        <path d="M0 -10 L3 0 L0 10 L-3 0 Z" fill="var(--color-navy-700)" />
        <text y="-20" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--color-navy-700)">
          N
        </text>
      </g>

      {/* hotline banner */}
      <rect x="0" y="576" width="480" height="44" fill="var(--color-navy-900)" />
      <g transform="translate(16, 590)">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 8} y={16 - [10, 16, 12, 14][i]} width="6" height={[10, 16, 12, 14][i]} fill="var(--color-orange-600)" />
        ))}
      </g>
      <text x="56" y="596" fontSize="11" fontWeight="700" fill="#fff">
        CLAYTON SPORTS HOTLINE: 314-290-8515
      </text>
      <text x="56" y="609" fontSize="6.5" fill="#c7d3ec">
        Cancellations &amp; delays — updated weekdays 4:00 PM, weekends 9:00 AM.
      </text>
    </svg>
  );
}
