'use client';

type ClearFormButtonProps = {
  disabled?: boolean;
  label?: string;
  onClick: () => void;
};

export function ClearFormButton({ disabled = false, label = 'Clear form', onClick }: ClearFormButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-full border border-[#c98673]/30 bg-[#fff7f4] px-4 py-2 text-sm text-[#8a4b38] transition-colors duration-150 hover:border-[#8a4b38]/35 hover:bg-[#fbe9e2] disabled:cursor-not-allowed disabled:border-line disabled:bg-white/60 disabled:text-muted disabled:opacity-60"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M6.5 6l1 14h9l1-14" />
        <path d="M10 10v6" />
        <path d="M14 10v6" />
      </svg>
      {label}
    </button>
  );
}
