export function CollateMark({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 246 182"
      fill="none"
      className={className}
    >
      <path d="M20 28C76 28 62 103 106 104C128 104 125 91 142 91" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
      <path d="M20 91C66 91 71 62 105 65C130 68 122 91 142 91" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
      <path d="M20 154C76 154 64 80 106 78C128 77 125 91 142 91" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
      <path d="M140 91H158" stroke="currentColor" strokeWidth="11" />
      <circle cx="170" cy="91" r="14" fill="#8DF1C9" />
      <path d="M184 91H226" stroke="#8DF1C9" strokeWidth="11" strokeLinecap="round" />
    </svg>
  );
}

export function CollateLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <CollateMark className="h-9 w-12 shrink-0" />
      <span className="relative text-[1.45rem] font-semibold leading-none tracking-[-0.06em]">
        collate<span className="text-[#8DF1C9]">.</span>
      </span>
    </span>
  );
}
