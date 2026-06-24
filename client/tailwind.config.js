export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1D9E75',
          light: '#E1F5EE',
          dark: '#0F6E56',
          darker: '#085041',
          50:  '#F0FDF9',
          100: '#CCFBEF',
          500: '#0D9488',
          600: '#0F766E',
          700: '#115E59',
        },
        surface: '#F8FAFB',
        background: '#F8FAFB',
        border: '#E2E8F0',
        muted: '#64748B',
        danger: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        elevated: '0 4px 12px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      }
    },
  },
  plugins: [],
}