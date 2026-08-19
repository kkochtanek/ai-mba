export default function SoccerBall({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="white" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M12 7.2l3.6 2.6-1.4 4.2H9.8l-1.4-4.2L12 7.2z"
        fill="currentColor"
      />
      <path
        d="M12 2v5.2M15.6 9.8l4.6-1.5M14.2 14l2.8 3.9M9.8 14l-2.8 3.9M8.4 9.8L3.8 8.3"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
