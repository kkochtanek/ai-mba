export default function Crest({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 240" className={className} role="img" aria-label="Mustangs crest">
      <defs>
        <linearGradient id="crestNavyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#122a52" />
          <stop offset="100%" stopColor="#081530" />
        </linearGradient>
      </defs>

      <path
        d="M120 8 L214 40 V126 C214 176 178 214 120 232 C62 214 26 176 26 126 V40 Z"
        fill="#aeb8c8"
        stroke="#7c8798"
        strokeWidth="2"
      />
      <path
        d="M120 20 L202 48 V124 C202 168 170 202 120 218 C70 202 38 168 38 124 V48 Z"
        fill="url(#crestNavyGrad)"
        stroke="#aeb8c8"
        strokeWidth="2"
      />

      <g fill="#aeb8c8">
        <path d="M97 42 l2.2 4.6 5 0.7 -3.6 3.5 0.9 5 -4.5 -2.4 -4.5 2.4 0.9-5 -3.6-3.5 5-0.7z" />
        <path d="M120 36 l2.4 5 5.5 0.7 -4 3.9 0.9 5.5 -4.8-2.6 -4.8 2.6 0.9-5.5 -4-3.9 5.5-0.7z" />
        <path d="M143 42 l2.2 4.6 5 0.7 -3.6 3.5 0.9 5 -4.5 -2.4 -4.5 2.4 0.9-5 -3.6-3.5 5-0.7z" />
      </g>

      <g transform="translate(58,40) scale(0.9)">
        <path
          fill="#eef1f4"
          d="M100,68 C97,55 92,44 82,25 C75,14 71,10 68,10 C66,4 62,-10 54,-12 C50,-6 48,0 46,6 C42,2 36,2 32,6 C36,10 40,12 44,12 C34,16 26,22 16,45 C10,60 7,80 6,105 C6,116 8,124 10,130 C18,134 28,137 34,138 C36,126 40,112 42,98 C43,90 44,85 44,80 C46,82 47,84 48,84 C52,86 55,85 58,84 C65,84 72,82 78,80 C84,77 90,72 100,68 Z"
        />
        <path
          fill="#0d1f40"
          d="M44,10 C36,14 24,22 16,44 C10,60 7,80 8,102 C11,92 13,80 16,68 C20,50 28,36 40,24 C45,18 49,12 50,6 Z"
        />
        <circle cx="58" cy="32" r="3.6" fill="#0d1f40" />
        <ellipse cx="92" cy="70" rx="4" ry="3" fill="#0d1f40" />
      </g>

      <rect x="42" y="184" width="156" height="26" rx="3" fill="#7c8798" />
      <rect x="46" y="187" width="148" height="20" rx="2" fill="#0d1f40" />
      <text
        x="120"
        y="202"
        textAnchor="middle"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize="15"
        fontWeight="900"
        fill="#eef1f4"
        letterSpacing="2"
      >
        MUSTANGS
      </text>
    </svg>
  );
}
