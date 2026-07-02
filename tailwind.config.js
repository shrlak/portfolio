/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Segoe UI"',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'monospace',
        ],
      },
      colors: {
        // Clean, SF-inspired neutral canvas
        canvas: '#ffffff',
        soft: '#f5f5f7',
        panel: '#fbfbfd',
        line: 'rgba(0,0,0,0.09)',
        ink: '#111114',
        subink: '#6e6e73',
        faint: '#a1a1a6',
        // Accents — biomedical vital / mechanical steel
        vital: '#e11d2e',
        'vital-soft': '#ffe9eb',
        steel: '#0071e3',
        night: '#0a0a0c',
      },
      maxWidth: { container: '1180px' },
      letterSpacing: {
        tightest: '-0.045em',
        display: '-0.03em',
        caps: '0.16em',
        widecaps: '0.26em',
      },
      borderRadius: {
        xl2: '1.25rem',
        '2xl2': '1.75rem',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(22px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        spinslow: { to: { transform: 'rotate(360deg)' } },
        spinrev: { to: { transform: 'rotate(-360deg)' } },
        ecg: { to: { strokeDashoffset: '0' } },
        pulse2: {
          '0%, 100%': { opacity: '0.35', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.04)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fade-in 0.8s ease both',
        marquee: 'marquee 34s linear infinite',
        spinslow: 'spinslow 26s linear infinite',
        spinrev: 'spinrev 20s linear infinite',
        pulse2: 'pulse2 4s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
