'use client';

import { useTheme } from '@/components/app/theme-provider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white/85 px-3 text-sm text-ink transition-colors duration-150 hover:border-ink/20"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span
        aria-hidden="true"
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs transition-colors duration-150 ${
          isDark ? 'bg-[#b9f49c] text-[#102014]' : 'bg-ink text-paper'
        }`}
      >
        {isDark ? 'D' : 'L'}
      </span>
      <span className="hidden sm:inline">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}
