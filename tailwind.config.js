/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'Inter Placeholder',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        portfolio: {
          /* 70% — light canvas (cool blue-white, not slate gray) */
          light: '#FAFCFF',
          'light-alt': '#EEF4FF',
          'light-muted': '#E0EAFF',
          /* 30% — dark secondary */
          dark: '#111827',
          surface: '#111827',
          card: '#1F2937',
          /* 10% — very dark accent depth */
          deep: '#030712',
          bg: '#030712',
          /* Accents */
          cyan: '#06B6D4',
          purple: '#8B5CF6',
          /* Text */
          ink: '#F9FAFB',
          'ink-dark': '#0F172A',
          muted: '#9CA3AF',
          'muted-dark': '#1E3A8A',
        },
      },
      borderColor: {
        portfolio: 'rgba(255, 255, 255, 0.08)',
        'portfolio-light': 'rgba(15, 23, 42, 0.08)',
      },
      boxShadow: {
        'glow-cyan': '0 0 60px -12px rgba(6, 182, 212, 0.35)',
        'glow-purple': '0 0 60px -12px rgba(139, 92, 246, 0.32)',
        'glass-soft':
          '0 24px 60px -24px rgba(0, 0, 0, 0.55), inset 0 1px 0 0 rgba(255, 255, 255, 0.06), 0 0 80px -36px rgba(6, 182, 212, 0.12)',
        'glass-light':
          '0 20px 50px -24px rgba(15, 23, 42, 0.12), inset 0 1px 0 0 rgba(255, 255, 255, 0.9), 0 0 60px -32px rgba(6, 182, 212, 0.08)',
        'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
      },
    },
  },
  plugins: [],
}
