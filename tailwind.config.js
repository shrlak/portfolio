/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        grotesk: ['Anton', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      colors: {
        background: '#0A0B10',
        graphite: '#0A0B10',
        surface: '#0E1119',
        'surface-2': '#141B26',
        'surface-3': '#1C2538',
        bone: '#ECE6D8',
        muted: '#7A8799',
        steel: '#404D62',
        vital: '#E63046',
        oxygen: '#7AB8E8',
      },
      maxWidth: {
        container: '1440px',
      },
      letterSpacing: {
        tightest: '-0.04em',
        display: '-0.03em',
        ui: '0.01em',
        caps: '0.18em',
        widecaps: '0.26em',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.85' },
        },
        ekg: {
          '0%': { strokeDashoffset: '2000' },
          '100%': { strokeDashoffset: '0' },
        },
        flow: {
          '0%': { transform: 'translateY(-40px)', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translateY(40px)', opacity: '0' },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 60s linear infinite',
        'spin-slower': 'spin-slow 120s linear infinite',
        breathe: 'breathe 4s ease-in-out infinite',
        ekg: 'ekg 6s linear infinite',
        flow: 'flow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
