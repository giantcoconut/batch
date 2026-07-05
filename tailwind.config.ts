import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './types/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: 'oklch(0.982 0.006 85)',
        ink: 'oklch(0.23 0.02 40)',
        muted: 'oklch(0.55 0.02 55)',
        line: 'oklch(0.87 0.01 70)',
        accent: 'oklch(0.56 0.11 36)',
        accentSoft: 'oklch(0.94 0.02 50)',
        success: 'oklch(0.56 0.12 155)',
        warning: 'oklch(0.62 0.13 70)',
        danger: 'oklch(0.56 0.13 25)'
      },
      boxShadow: {
        sheet: '0 24px 80px rgba(49, 39, 24, 0.08)',
      },
      letterSpacing: {
        terminal: '0.14em',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['ui-serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
