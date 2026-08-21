type FieldId = "3" | "5" | "5B";

type FieldSpec = {
  id: string;
  cx: number;
  cy: number;
  w: number;
  h: number;
  rot?: number;
  label: string;
  big?: boolean;
  pitch?: boolean;
  tag?: string;
};

const FIELDS: FieldSpec[] = [
  { id: "7", cx: 109, cy: 308, w: 108, h: 66, label: "7", big: true, pitch: true, tag: "Adzick" },
  { id: "6", cx: 127, cy: 392, w: 118, h: 86, label: "6", big: true, pitch: true },
  { id: "6c", cx: 163, cy: 418, w: 30, h: 22, label: "6c" },
  { id: "6d", cx: 160, cy: 443, w: 35, h: 22, label: "6d" },
  { id: "5A", cx: 236, cy: 380, w: 52, h: 64, rot: -8, label: "5A", pitch: true },
  { id: "5B", cx: 261, cy: 346, w: 54, h: 46, rot: -8, label: "5B", pitch: true },
  { id: "5c", cx: 279, cy: 383, w: 32, h: 42, rot: 12, label: "5c" },
  { id: "3", cx: 345, cy: 225, w: 52, h: 36, rot: -25, label: "3", pitch: true },
  { id: "3a", cx: 349, cy: 272, w: 38, h: 27, rot: -25, label: "3a" },
  { id: "1a", cx: 328, cy: 438, w: 46, h: 32, rot: 16, label: "1a", pitch: true },
  { id: "1b", cx: 346, cy: 472, w: 42, h: 30, rot: 16, label: "1b" },
];

const HIGHLIGHT: Record<FieldId, string> = { "5": "5A", "5B": "5B", "3": "3" };

/** Dense scattered tree canopy, roughly matching the wooded coverage on the real map. */
const TREES: { x: number; y: number; s: number }[] = [
  { x: 42, y: 240, s: 1 }, { x: 58, y: 260, s: 0.8 }, { x: 44, y: 340, s: 0.9 },
  { x: 60, y: 420, s: 1 }, { x: 50, y: 460, s: 0.8 }, { x: 80, y: 480, s: 0.9 },
  { x: 195, y: 260, s: 0.9 }, { x: 210, y: 245, s: 0.7 }, { x: 205, y: 300, s: 0.9 },
  { x: 190, y: 320, s: 0.8 }, { x: 195, y: 445, s: 1 }, { x: 175, y: 465, s: 0.9 },
  { x: 220, y: 470, s: 0.8 }, { x: 300, y: 200, s: 0.9 }, { x: 330, y: 180, s: 0.8 },
  { x: 355, y: 190, s: 0.7 }, { x: 380, y: 175, s: 0.9 }, { x: 300, y: 300, s: 1 },
  { x: 320, y: 320, s: 0.9 }, { x: 300, y: 340, s: 0.8 }, { x: 320, y: 400, s: 0.9 },
  { x: 300, y: 420, s: 1 }, { x: 340, y: 415, s: 0.8 }, { x: 270, y: 430, s: 0.8 },
  { x: 250, y: 460, s: 0.9 }, { x: 285, y: 470, s: 0.9 }, { x: 310, y: 500, s: 0.8 },
  { x: 260, y: 505, s: 0.9 }, { x: 220, y: 500, s: 0.8 }, { x: 160, y: 500, s: 0.9 },
  { x: 130, y: 490, s: 0.8 }, { x: 100, y: 445, s: 0.9 }, { x: 90, y: 400, s: 0.8 },
  { x: 240, y: 250, s: 0.7 }, { x: 265, y: 265, s: 0.7 }, { x: 400, y: 200, s: 0.9 },
  { x: 415, y: 240, s: 0.8 }, { x: 395, y: 340, s: 0.8 }, { x: 250, y: 200, s: 0.7 },
  { x: 140, y: 250, s: 0.7 },
];

function Tree({ x, y, s }: { x: number; y: number; s: number }) {
  const r = 8.5 * s;
  return (
    <g transform={`translate(${x}, ${y})`} fill="#5f8a56" opacity="0.65">
      <circle cx={-r * 0.55} cy={r * 0.15} r={r * 0.82} />
      <circle cx={r * 0.55} cy={-r * 0.2} r={r * 0.9} />
      <circle cy={r * 0.5} r={r * 0.7} />
      <circle r={r} opacity="0.9" />
    </g>
  );
}

function PicnicTable({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} stroke="#8a6a3f" strokeWidth="1.4" fill="none">
      <line x1="-6" y1="-3" x2="6" y2="-3" />
      <line x1="-7" y1="3" x2="-3" y2="-1" />
      <line x1="7" y1="3" x2="3" y2="-1" />
      <line x1="-5" y1="-3" x2="-5" y2="2" />
      <line x1="5" y1="-3" x2="5" y2="2" />
    </g>
  );
}

function SoccerField({ f, active }: { f: FieldSpec; active: boolean }) {
  const fill = active ? "var(--color-orange-100)" : "#7cad64";
  const stroke = active ? "var(--color-orange-600)" : "#ffffff";
  const frameStroke = active ? "var(--color-orange-600)" : "#4c7a3f";
  const sw = active ? 2.5 : 1.3;
  return (
    <g transform={`translate(${f.cx}, ${f.cy}) rotate(${f.rot ?? 0})`}>
      <rect x={-f.w / 2} y={-f.h / 2} width={f.w} height={f.h} rx="2" fill={fill} stroke={frameStroke} strokeWidth={sw} />
      {f.pitch && (
        <g stroke={stroke} strokeWidth="1" fill="none" opacity="0.95">
          <rect x={-f.w / 2 + 3} y={-f.h / 2 + 3} width={f.w - 6} height={f.h - 6} />
          {f.big && <line x1={-f.w / 2 + 3} y1="0" x2={f.w / 2 - 3} y2="0" />}
          <rect x={-9} y={-f.h / 2 + 3} width="18" height="7" />
          {f.big ? (
            <>
              <rect x={-9} y={f.h / 2 - 10} width="18" height="7" />
              <circle r="8" />
            </>
          ) : null}
        </g>
      )}
      {f.tag && (
        <g>
          <rect x={-22} y={-f.h / 2 - 17} width="44" height="13" rx="2" fill="#1b1f24" />
          <text y={-f.h / 2 - 7} textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff">
            {f.tag}
          </text>
        </g>
      )}
      <circle r={f.w < 45 ? 7.5 : 10.5} fill="#ffffff" stroke={frameStroke} strokeWidth="1.3" />
      <text
        y={f.w < 45 ? 2.5 : 3.5}
        textAnchor="middle"
        fontSize={f.w < 45 ? 7 : 9.5}
        fontWeight="700"
        fill={active ? "var(--color-orange-700)" : "#28421f"}
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

export default function ShawParkMap({ activeField }: { activeField: FieldId }) {
  const activeId = HIGHLIGHT[activeField];
  const active = FIELDS.find((f) => f.id === activeId)!;
  const pinY = active.cy - active.h / 2 - Math.abs(Math.sin((active.rot ?? 0) * (Math.PI / 180))) * active.w * 0.4 - (active.tag ? 22 : 8);

  return (
    <svg viewBox="0 0 480 636" className="w-full h-auto" role="img" aria-label="Charles A. Shaw Park map">
      <rect width="480" height="636" fill="#ffffff" />
      <text x="18" y="26" fontSize="19" fontWeight="800" fill="#14181c">
        Charles A. Shaw Park
      </text>

      <rect x="16" y="46" width="452" height="522" fill="#dcdfe2" />
      <rect x="32" y="82" width="420" height="478" rx="4" fill="#8fb377" />

      {TREES.map((t, i) => (
        <Tree key={i} {...t} />
      ))}

      {/* winding paths */}
      <g stroke="#eef1e6" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.9">
        <path d="M180 300 Q230 320 260 300 Q300 280 330 300" />
        <path d="M230 320 Q235 360 260 400 Q280 430 270 460" />
        <path d="M150 300 Q140 350 160 400 Q175 430 165 470" />
        <path d="M330 300 Q360 320 370 360 Q380 400 350 430" />
        <path d="M270 460 Q300 480 340 470" />
      </g>

      {/* roads */}
      <g stroke="#33393f" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 108 Q90 82 158 95 Q190 100 194 132 L196 260" />
        <path d="M304 82 Q328 148 340 220" />
        <path d="M340 98 Q406 146 464 200" />
        <path d="M14 464 Q140 502 252 496 Q302 491 332 464" />
        <path d="M14 464 L14 566" />
        <path d="M464 88 L464 566" />
      </g>
      <circle cx="180" cy="202" r="30" fill="none" stroke="#33393f" strokeWidth="11" />
      <g stroke="#f5f2e6" strokeWidth="1.3" strokeDasharray="9 9" fill="none" strokeLinecap="round" opacity="0.9">
        <path d="M14 108 Q90 82 158 95 Q190 100 194 132 L196 260" />
        <path d="M304 82 Q328 148 340 220" />
        <path d="M340 98 Q406 146 464 200" />
        <path d="M14 464 Q140 502 252 496 Q302 491 332 464" />
        <path d="M464 88 L464 566" />
      </g>
      <circle cx="180" cy="202" r="30" fill="none" stroke="#f5f2e6" strokeWidth="1" strokeDasharray="7 7" opacity="0.75" />
      {/* Gay Ave angled-parking hatch marks */}
      <g stroke="#f5f2e6" strokeWidth="1.3" opacity="0.85">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1={30 + i * 18} y1={92 - i * 1.5} x2={38 + i * 18} y2={104 - i * 1.5} />
        ))}
      </g>

      <text x="20" y="99" fontSize="7.5" fontWeight="700" fill="#3a4149" transform="rotate(-13 20 99)">GAY AVE.</text>
      <text x="199" y="185" fontSize="7" fontWeight="700" fill="#3a4149" transform="rotate(78 199 185)">TOPTON WAY</text>
      <text x="202" y="236" fontSize="6" fontWeight="700" fill="#3a4149">MARK TWAIN CIR.</text>
      <text x="294" y="148" fontSize="7" fontWeight="700" fill="#3a4149" transform="rotate(68 294 148)">PARKSIDE DR.</text>
      <text x="384" y="138" fontSize="7" fontWeight="700" fill="#3a4149" transform="rotate(30 384 138)">FORSYTH BLVD.</text>
      <text x="60" y="506" fontSize="7.5" fontWeight="700" fill="#3a4149">FOREST PARK PKWY</text>
      <text x="130" y="484" fontSize="6.5" fontWeight="700" fill="#3a4149">SHAW PARK DR.</text>
      <text x="472" y="330" fontSize="7" fontWeight="700" fill="#3a4149" transform="rotate(90 472 330)">S. BRENTWOOD BLVD.</text>

      {/* Center of Clayton campus */}
      <rect x="62" y="150" width="52" height="30" rx="2" fill="#9aa6b4" />
      <rect x="112" y="144" width="60" height="40" rx="2" fill="#8a97a6" />
      <rect x="90" y="176" width="46" height="26" rx="2" fill="#a9b3bf" />
      <text x="66" y="168" fontSize="9.5" fontWeight="800" fill="#1c5aa6">The Center</text>
      <text x="66" y="196" fontSize="9.5" fontWeight="800" fill="#1c5aa6">of Clayton</text>
      <rect x="96" y="202" width="52" height="30" rx="2" fill="#d1ad9c" />
      <rect x="140" y="208" width="48" height="36" rx="2" fill="#c99f8c" />
      <text x="96" y="252" fontSize="8" fontWeight="800" fill="#c1421f">Clayton High School</text>
      <rect x="232" y="222" width="60" height="26" rx="2" fill="#b7c0cb" />
      <text x="236" y="234" fontSize="5.5" fontWeight="700" fill="#3a4149">School District</text>
      <text x="236" y="242" fontSize="5.5" fontWeight="700" fill="#3a4149">of Clayton Admin</text>
      <text x="234" y="216" fontSize="5.5" fontWeight="600" fontStyle="italic" fill="#3a4149">Newman Green</text>

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
      <text x="386" y="122" fontSize="6.5" fontWeight="700" fill="#3a4149">Chapman Plaza</text>

      {/* pavilions */}
      <path d="M388 182 L404 174 L420 182 L416 190 L392 190 Z" fill="#5b6672" />
      <text x="376" y="200" fontSize="5.8" fontWeight="700" fill="#3a4149">Barry Wehmiller Pav.</text>
      <path d="M232 340 L250 330 L268 340 L263 350 L237 350 Z" fill="#5b6672" />
      <text x="218" y="362" fontSize="5.8" fontWeight="700" fill="#3a4149">Enterprise Holdings Pav.</text>
      <path d="M172 388 L184 381 L196 388 L192 396 L176 396 Z" fill="#5b6672" />
      <text x="160" y="406" fontSize="5.6" fontWeight="700" fill="#3a4149">S. Shelter</text>
      <path d="M310 226 L320 220 L330 226 L327 233 L313 233 Z" fill="#5b6672" />
      <text x="296" y="216" fontSize="5.6" fontWeight="700" fill="#3a4149">N. Shelter</text>

      {/* playgrounds */}
      <g transform="translate(292, 250)">
        <circle r="4.5" fill="#c1421f" />
        <circle cx="4" cy="-3" r="3.5" fill="#f5b544" />
        <circle cx="-4" cy="-3" r="3" fill="#1c5aa6" />
      </g>
      <text x="272" y="266" fontSize="5.6" fontWeight="700" fill="#3a4149">Tree Top Playground</text>
      <g transform="translate(214, 418)">
        <circle r="4.5" fill="#c1421f" />
        <circle cx="4" cy="-3" r="3.5" fill="#f5b544" />
        <circle cx="-4" cy="-3" r="3" fill="#1c5aa6" />
      </g>
      <text x="196" y="434" fontSize="5.6" fontWeight="700" fill="#3a4149">Playground</text>

      {/* volleyball */}
      <rect x="188" y="248" width="24" height="16" fill="#d9c9a3" opacity="0.9" />
      <text x="184" y="272" fontSize="5.4" fontWeight="700" fill="#3a4149">Volleyball Courts</text>

      {/* restrooms */}
      {[
        [230, 268],
        [172, 412],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x}, ${y})`}>
          <rect x="-6" y="-6" width="12" height="12" rx="2" fill="var(--color-navy-600)" />
          <circle cx="-2" r="2" fill="#fff" />
          <circle cx="2" r="2" fill="#fff" />
        </g>
      ))}

      {/* Aquatic Center */}
      <rect x="380" y="226" width="70" height="96" rx="6" fill="#eef0e4" stroke="#c9c3b2" />
      <path d="M388 236 h54 v10 a4 4 0 0 1 -4 4 h-46 a4 4 0 0 1 -4 -4 Z" fill="#c9c3b2" />
      <rect x="390" y="254" width="50" height="36" rx="4" fill="#7fc4e8" stroke="#5b9fc4" />
      <text x="384" y="304" fontSize="6.5" fontWeight="700" fill="#3a4149">Shaw Park</text>
      <text x="384" y="313" fontSize="6.5" fontWeight="700" fill="#3a4149">Aquatic Center</text>

      {/* Tennis Center */}
      <rect x="368" y="426" width="82" height="82" rx="3" fill="#4f8f98" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={372 + i * 26.5} y="430" width="23" height="74" fill="#3a7078" stroke="#fff" strokeWidth="1.2" />
      ))}
      <text x="364" y="516" fontSize="6.5" fontWeight="700" fill="#3a4149">Shaw Park Tennis Center</text>

      {/* picnic sites */}
      {[
        [258, 350],
        [286, 368],
        [262, 392],
        [292, 400],
      ].map(([x, y], i) => (
        <g key={i}>
          <PicnicTable x={x} y={y} />
          <text x={x - 14} y={y + 14} fontSize="5.2" fontWeight="700" fill="#3a4149">
            Picnic {i + 1}
          </text>
        </g>
      ))}

      {/* fields */}
      {FIELDS.map((f) => (
        <SoccerField key={f.id} f={f} active={f.id === activeId} />
      ))}

      {/* pin on active field */}
      <g transform={`translate(${active.cx}, ${pinY})`}>
        <Pin />
      </g>

      {/* legend */}
      <g transform="translate(148, 66)">
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
          <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#e7ecf3" />
        </g>
        <text x="30" y="61" fontSize="8" fontWeight="700" fill="#fff">Restrooms (Apr 1–Oct 31)</text>
      </g>

      {/* compass */}
      <g transform="translate(430, 100)">
        <path d="M0 -16 L6 0 L0 16 L-6 0 Z" fill="#f2f2f2" stroke="#3a4149" strokeWidth="1" />
        <path d="M0 -16 L6 0 L0 0 Z" fill="#8a94a0" />
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
