type FieldId = "3" | "5" | "5B";

type RectField = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  pitch?: boolean;
  tag?: string;
};

type DiamondField = { id: string; cx: number; cy: number; r: number; label: string };

const RECT_FIELDS: RectField[] = [
  { id: "7", x: 55, y: 258, w: 108, h: 66, label: "7", pitch: true, tag: "Adzick" },
  { id: "6", x: 68, y: 332, w: 118, h: 86, label: "6", pitch: true },
  { id: "6c", x: 150, y: 390, w: 28, h: 22, label: "6c" },
  { id: "6d", x: 145, y: 415, w: 33, h: 22, label: "6d" },
  { id: "5A", x: 210, y: 348, w: 52, h: 62, label: "5A", pitch: true },
  { id: "5B", x: 234, y: 322, w: 54, h: 46, label: "5B", pitch: true },
  { id: "5c", x: 260, y: 358, w: 32, h: 40, label: "5c" },
];

const DIAMOND_FIELDS: DiamondField[] = [
  { id: "3", cx: 348, cy: 250, r: 28, label: "3" },
  { id: "3a", cx: 350, cy: 300, r: 20, label: "3a" },
  { id: "1a", cx: 330, cy: 452, r: 22, label: "1a" },
  { id: "1b", cx: 340, cy: 492, r: 20, label: "1b" },
];

/** Scattered tree-canopy texture — organic blob clusters, drawn under everything. */
const TREE_CLUSTERS: { x: number; y: number; s: number }[] = [
  { x: 44, y: 220, s: 1 }, { x: 195, y: 260, s: 0.8 }, { x: 205, y: 300, s: 0.9 },
  { x: 300, y: 200, s: 0.9 }, { x: 330, y: 175, s: 0.8 }, { x: 200, y: 440, s: 1 },
  { x: 300, y: 430, s: 1.1 }, { x: 320, y: 400, s: 0.8 }, { x: 360, y: 360, s: 0.9 },
  { x: 400, y: 200, s: 0.9 }, { x: 60, y: 400, s: 0.9 }, { x: 90, y: 470, s: 0.8 },
  { x: 250, y: 500, s: 1 }, { x: 400, y: 470, s: 0.9 }, { x: 300, y: 530, s: 0.8 },
  { x: 160, y: 500, s: 0.8 },
];

function TreeCluster({ x, y, s }: { x: number; y: number; s: number }) {
  const r = 9 * s;
  return (
    <g transform={`translate(${x}, ${y})`} fill="#8fb789" opacity="0.55">
      <circle cx={-r * 0.5} r={r} />
      <circle cx={r * 0.6} cy={-r * 0.3} r={r * 0.85} />
      <circle cy={r * 0.5} r={r * 0.75} />
    </g>
  );
}

function SoccerPitch({ f, active }: { f: RectField; active: boolean }) {
  const lineColor = active ? "var(--color-orange-700)" : "#ffffff";
  return (
    <g>
      <rect
        x={f.x}
        y={f.y}
        width={f.w}
        height={f.h}
        rx="2"
        fill={active ? "var(--color-orange-100)" : "#7fb56c"}
        stroke={active ? "var(--color-orange-600)" : "#4f7d43"}
        strokeWidth={active ? 3 : 1.5}
      />
      {f.pitch && (
        <g stroke={lineColor} strokeWidth="1" fill="none" opacity="0.9">
          <rect x={f.x + 3} y={f.y + 3} width={f.w - 6} height={f.h - 6} />
          <line x1={f.x + 3} y1={f.y + f.h / 2} x2={f.x + f.w - 3} y2={f.y + f.h / 2} />
          <rect x={f.x + f.w / 2 - 9} y={f.y + 3} width="18" height="8" />
          <rect x={f.x + f.w / 2 - 9} y={f.y + f.h - 11} width="18" height="8" />
          {f.w > 90 && <circle cx={f.x + f.w / 2} cy={f.y + f.h / 2} r="9" />}
        </g>
      )}
      {f.tag && (
        <g>
          <rect x={f.x + f.w / 2 - 22} y={f.y - 18} width="44" height="14" rx="3" fill="#1b1f24" />
          <text x={f.x + f.w / 2} y={f.y - 8} textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff">
            {f.tag}
          </text>
        </g>
      )}
      <circle
        cx={f.x + f.w / 2}
        cy={f.y + f.h / 2}
        r={f.w < 45 ? 8 : 11}
        fill="#ffffff"
        stroke={active ? "var(--color-orange-600)" : "#4f7d43"}
        strokeWidth="1.5"
      />
      <text
        x={f.x + f.w / 2}
        y={f.y + f.h / 2 + (f.w < 45 ? 2.5 : 3.5)}
        textAnchor="middle"
        fontSize={f.w < 45 ? 7 : 9.5}
        fontWeight="700"
        fontFamily="var(--font-body, sans-serif)"
        fill={active ? "var(--color-orange-700)" : "#2b4324"}
      >
        {f.label}
      </text>
    </g>
  );
}

function Diamond({ f, active }: { f: DiamondField; active: boolean }) {
  return (
    <g transform={`translate(${f.cx}, ${f.cy})`}>
      <path
        d={`M0 ${-f.r} L${f.r} 0 L0 ${f.r} L${-f.r} 0 Z`}
        fill={active ? "var(--color-orange-100)" : "#a9c98f"}
        stroke={active ? "var(--color-orange-600)" : "#5b8f4a"}
        strokeWidth={active ? 3 : 1.5}
      />
      <path
        d={`M0 0 L0 ${-f.r * 0.62} A${f.r * 0.62} ${f.r * 0.62} 0 0 1 ${f.r * 0.62} 0 Z`}
        fill="#cbb27f"
        opacity="0.9"
      />
      <circle
        r={f.r < 24 ? 8 : 10}
        fill="#ffffff"
        stroke={active ? "var(--color-orange-600)" : "#5b8f4a"}
        strokeWidth="1.5"
      />
      <text
        y={f.r < 24 ? 2.5 : 3.5}
        textAnchor="middle"
        fontSize={f.r < 24 ? 7 : 9}
        fontWeight="700"
        fontFamily="var(--font-body, sans-serif)"
        fill={active ? "var(--color-orange-700)" : "#3f5c30"}
      >
        {f.label}
      </text>
    </g>
  );
}

function Pin() {
  return (
    <g>
      <circle r="9" fill="var(--color-navy-900)">
        <animate attributeName="r" values="9;11;9" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <path d="M0 9 L-7 -3 A7 7 0 1 1 7 -3 Z" fill="var(--color-navy-900)" />
      <circle r="3" fill="var(--color-orange-600)" />
    </g>
  );
}

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
  const pinY = activeRect ? activeRect.y - (activeRect.tag ? 24 : 4) : activeDiamond ? activeDiamond.cy - activeDiamond.r - 6 : 0;

  return (
    <svg viewBox="0 0 480 636" className="w-full h-auto" role="img" aria-label="Charles A. Shaw Park map">
      <rect width="480" height="636" fill="#ffffff" />
      <text x="18" y="26" fontSize="18" fontWeight="800" fontFamily="var(--font-body, sans-serif)" fill="#14181c">
        Charles A. Shaw Park
      </text>

      {/* surrounding street grid backdrop */}
      <rect x="16" y="46" width="452" height="522" fill="#dfe2e5" />

      {/* park green */}
      <path
        d="M40 60 Q30 90 55 100 L120 60 Z"
        fill="#dfe2e5"
      />
      <rect x="34" y="86" width="416" height="472" rx="6" fill="#a9d0a3" />
      <rect x="34" y="86" width="416" height="472" rx="6" fill="url(#parkTexture)" opacity="0.35" />

      <defs>
        <pattern id="parkTexture" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="none" />
          <circle cx="3" cy="3" r="1" fill="#5b8f4a" opacity="0.4" />
        </pattern>
      </defs>

      {/* tree canopy texture */}
      {TREE_CLUSTERS.map((t, i) => (
        <TreeCluster key={i} {...t} />
      ))}

      {/* roads */}
      <g stroke="#3a4149" strokeWidth="11" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 108 Q90 84 158 96 Q188 101 192 132 L194 260" />
        <path d="M302 84 Q326 150 338 220" />
        <path d="M338 100 Q404 148 464 202" />
        <path d="M14 466 Q140 504 252 498 Q302 493 332 466" />
        <path d="M14 466 L14 566" />
        <path d="M464 90 L464 566" />
      </g>
      <circle cx="178" cy="204" r="30" fill="none" stroke="#3a4149" strokeWidth="10" />
      <g stroke="#eef0e4" strokeWidth="1.4" strokeDasharray="8 8" fill="none" strokeLinecap="round" opacity="0.85">
        <path d="M14 108 Q90 84 158 96 Q188 101 192 132 L194 260" />
        <path d="M302 84 Q326 150 338 220" />
        <path d="M338 100 Q404 148 464 202" />
        <path d="M14 466 Q140 504 252 498 Q302 493 332 466" />
        <path d="M464 90 L464 566" />
      </g>
      <circle cx="178" cy="204" r="30" fill="none" stroke="#eef0e4" strokeWidth="1" strokeDasharray="6 6" opacity="0.7" />

      <text x="20" y="100" fontSize="7.5" fontWeight="700" fill="#4a5361" transform="rotate(-13 20 100)">GAY AVE.</text>
      <text x="197" y="185" fontSize="7" fontWeight="700" fill="#4a5361" transform="rotate(78 197 185)">TOPTON WAY</text>
      <text x="200" y="238" fontSize="6" fontWeight="700" fill="#4a5361">MARK TWAIN CIR.</text>
      <text x="292" y="150" fontSize="7" fontWeight="700" fill="#4a5361" transform="rotate(68 292 150)">PARKSIDE DR.</text>
      <text x="382" y="140" fontSize="7" fontWeight="700" fill="#4a5361" transform="rotate(30 382 140)">FORSYTH BLVD.</text>
      <text x="60" y="508" fontSize="7.5" fontWeight="700" fill="#4a5361">FOREST PARK PKWY</text>
      <text x="130" y="486" fontSize="6.5" fontWeight="700" fill="#4a5361">SHAW PARK DR.</text>
      <text x="470" y="330" fontSize="7" fontWeight="700" fill="#4a5361" transform="rotate(90 470 330)">S. BRENTWOOD BLVD.</text>

      {/* buildings */}
      <rect x="64" y="146" width="118" height="60" rx="3" fill="#9aa6b4" />
      <rect x="64" y="146" width="118" height="14" fill="#828fa0" />
      <text x="70" y="172" fontSize="9.5" fontWeight="800" fill="#1c5aa6">The Center</text>
      <text x="70" y="184" fontSize="9.5" fontWeight="800" fill="#1c5aa6">of Clayton</text>
      <rect x="98" y="202" width="90" height="44" rx="3" fill="#d1ad9c" />
      <text x="100" y="228" fontSize="8" fontWeight="800" fill="#c1421f">Clayton High School</text>
      <rect x="232" y="222" width="60" height="28" rx="3" fill="#b7c0cb" />
      <text x="236" y="234" fontSize="5.5" fontWeight="700" fill="#3a4149">School District</text>
      <text x="236" y="242" fontSize="5.5" fontWeight="700" fill="#3a4149">of Clayton Admin</text>
      <text x="234" y="216" fontSize="5.5" fontWeight="600" fill="#3a4149" fontStyle="italic">Newman Green</text>

      {/* parking */}
      {[
        [156, 96],
        [46, 176],
        [270, 258],
        [140, 464],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x}, ${y})`}>
          <circle r="9.5" fill="#ffffff" stroke="var(--color-navy-600)" strokeWidth="1.5" />
          <text y="3.5" textAnchor="middle" fontSize="10" fontWeight="800" fill="var(--color-navy-600)">
            P
          </text>
        </g>
      ))}

      {/* pond + Chapman Plaza */}
      <path d="M406 132 Q420 122 432 134 Q440 146 428 156 Q414 164 404 152 Q398 140 406 132 Z" fill="#7fb3d8" />
      <text x="386" y="122" fontSize="6.5" fontWeight="700" fill="#3a4149">
        Chapman Plaza
      </text>

      {/* Barry Wehmiller Pavilion */}
      <path d="M388 182 L404 174 L420 182 L416 190 L392 190 Z" fill="#5b6672" />
      <text x="376" y="200" fontSize="5.8" fontWeight="700" fill="#3a4149">Barry Wehmiller Pav.</text>

      {/* Aquatic Center */}
      <rect x="380" y="226" width="70" height="96" rx="6" fill="#eef0e4" stroke="#c9c3b2" />
      <path d="M388 236 h54 v10 a4 4 0 0 1 -4 4 h-46 a4 4 0 0 1 -4 -4 Z" fill="#c9c3b2" />
      <rect x="390" y="254" width="50" height="36" rx="4" fill="#7fc4e8" stroke="#5b9fc4" />
      <text x="384" y="304" fontSize="6.5" fontWeight="700" fill="#3a4149">Shaw Park</text>
      <text x="384" y="313" fontSize="6.5" fontWeight="700" fill="#3a4149">Aquatic Center</text>

      {/* Tennis Center */}
      <rect x="368" y="426" width="82" height="82" rx="3" fill="#5b9fa8" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={372 + i * 26.5} y="430" width="23" height="74" fill="#3f8590" stroke="#fff" strokeWidth="1.2" />
      ))}
      <text x="364" y="516" fontSize="6.5" fontWeight="700" fill="#3a4149">
        Shaw Park Tennis Center
      </text>

      {/* amenity markers */}
      {(
        [
          [292, 258, ["Tree Top", "Playground"]],
          [318, 234, ["N. Shelter"]],
          [198, 258, ["Volleyball", "Courts"]],
          [252, 350, ["Enterprise", "Holdings Pav."]],
          [182, 396, ["S. Shelter"]],
          [214, 422, ["Playground"]],
        ] as [number, number, string[]][]
      ).map(([x, y, lines], i) => (
        <g key={i} transform={`translate(${x}, ${y})`}>
          <circle r="4.5" fill="#2f6b3f" />
          <circle r="2" fill="#eef0e4" />
          {lines.map((line, li) => (
            <text key={li} y={13 + li * 7} x="-18" fontSize="5.6" fontWeight="700" fill="#3a4149">
              {line}
            </text>
          ))}
        </g>
      ))}

      {/* picnic sites */}
      {[
        [268, 355, "1"],
        [296, 372, "2"],
        [270, 394, "3"],
        [302, 402, "4"],
      ].map(([x, y, n], i) => (
        <g key={i} transform={`translate(${x}, ${y})`}>
          <circle r="5" fill="#c9895a" />
          <text y="12" x="-2" fontSize="5.2" fontWeight="700" fill="#3a4149">
            Picnic {n}
          </text>
        </g>
      ))}

      {/* tan open-use patches */}
      <ellipse cx="205" cy="330" rx="26" ry="16" fill="#d9c9a3" opacity="0.8" />
      <ellipse cx="204" cy="358" rx="22" ry="14" fill="#d9c9a3" opacity="0.8" />

      {/* fields */}
      {RECT_FIELDS.map((f) => (
        <SoccerPitch key={f.id} f={f} active={highlight.kind === "rect" && f.id === highlight.id} />
      ))}
      {DIAMOND_FIELDS.map((f) => (
        <Diamond key={f.id} f={f} active={highlight.kind === "diamond" && f.id === highlight.id} />
      ))}

      {/* pin on active field */}
      <g transform={`translate(${pinX}, ${pinY})`}>
        <Pin />
      </g>

      {/* legend */}
      <g transform="translate(240, 108)">
        <rect width="204" height="72" rx="5" fill="#2c333a" opacity="0.94" />
        <g transform="translate(14, 16)">
          <circle r="9" fill="#fff" stroke="#3a4149" strokeWidth="1.2" />
          <text y="3.5" textAnchor="middle" fontSize="8" fontWeight="800" fill="#3a4149">3</text>
        </g>
        <text x="30" y="20" fontSize="8.5" fontWeight="700" fill="#fff">Baseball / Softball Field</text>
        <g transform="translate(14, 38)">
          <circle r="9" fill="#fff" stroke="var(--color-navy-600)" strokeWidth="1.2" />
          <text y="3.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="var(--color-navy-600)">P</text>
        </g>
        <text x="30" y="42" fontSize="8.5" fontWeight="700" fill="#fff">Parking</text>
        <g transform="translate(14, 58)">
          <circle r="7" fill="#eef0e4" />
        </g>
        <text x="30" y="61" fontSize="8" fontWeight="700" fill="#fff">Restrooms (Apr 1–Oct 31)</text>
      </g>

      {/* compass */}
      <g transform="translate(436, 130)">
        <path d="M0 -16 L6 0 L0 16 L-6 0 Z" fill="#3a4149" />
        <path d="M0 -16 L6 0 L0 0 Z" fill="#7a8794" />
        <text y="-22" textAnchor="middle" fontSize="9" fontWeight="800" fill="#3a4149">N</text>
      </g>

      {/* hotline banner */}
      <rect x="0" y="568" width="480" height="68" fill="#ffffff" />
      <line x1="0" y1="568" x2="480" y2="568" stroke="#dfe2e5" strokeWidth="1.5" />
      <g transform="translate(18, 586)">
        {[9, 15, 11, 13].map((h, i) => (
          <rect key={i} x={i * 8} y={18 - h} width="6" height={h} fill="#14181c" />
        ))}
        <circle cx="16" cy="-6" r="5" fill="none" stroke="#14181c" strokeWidth="1.4" />
      </g>
      <text x="60" y="596" fontSize="12" fontWeight="800" fill="#14181c">
        CLAYTON SPORTS HOTLINE: (314) 290-8515
      </text>
      <text x="60" y="609" fontSize="6.5" fill="#5b6672">
        Cancellations, delays &amp; game times — updated weekdays 4:00 PM, weekends 9:00 AM.
      </text>
      <text x="18" y="628" fontSize="6" fontWeight="700" fill="#14181c" letterSpacing="0.05em">
        CLAYTON · MISSOURI
      </text>
    </svg>
  );
}
