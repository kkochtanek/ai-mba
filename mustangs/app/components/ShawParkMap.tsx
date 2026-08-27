type FieldId = "3" | "3A" | "5" | "5B" | "6" | "6D";

/** Percent position of each field's number badge, read directly off the source PDF's text layer. */
const FIELD_POS: Record<FieldId, { x: number; y: number }> = {
  "3": { x: 68.3, y: 43.0 },
  "3A": { x: 69.5, y: 47.5 },
  "5": { x: 36.1, y: 58.9 },
  "5B": { x: 41.8, y: 54.4 },
  "6": { x: 22.1, y: 58.8 },
  "6D": { x: 30.2, y: 62.8 },
};

export default function ShawParkMap({ activeField }: { activeField: FieldId }) {
  const pos = FIELD_POS[activeField];

  return (
    <div className="relative w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/shaw-park-map.jpg"
        alt="Charles A. Shaw Park map"
        className="w-full h-auto rounded-sm border border-navy-100"
      />
      <div
        className="absolute -translate-x-1/2 -translate-y-[calc(100%+6px)]"
        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      >
        <svg width="26" height="30" viewBox="0 0 26 30">
          <circle cx="13" cy="13" r="9" fill="var(--color-navy-900)">
            <animate attributeName="r" values="9;11;9" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <path d="M13 22 L6 10 A7 7 0 1 1 20 10 Z" fill="var(--color-navy-900)" />
          <circle cx="13" cy="13" r="3" fill="var(--color-silver-600)" />
        </svg>
      </div>
    </div>
  );
}
