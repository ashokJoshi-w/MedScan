export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
          dark: '#059669',
          darker: '#047857',
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        ink: {
          DEFAULT: '#0F172A',
          muted: '#64748B',
          faint: '#94A3B8',
        },
        surface: '#F8FAFC',
        section: '#F5F7FB',
        background: '#F8FAFC',
        border: '#E5E7EB',
        muted: '#64748B',
        danger: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
        accent: {
          blue: '#3B82F6',
          'blue-soft': '#DBEAFE',
          green: '#10B981',
          purple: '#8B5CF6',
          orange: '#F97316',
          amber: '#F59E0B',
          red: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.03)',
        elevated: '0 4px 24px rgba(15, 23, 42, 0.06)',
        soft: '0 8px 32px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 8px 32px rgba(16, 185, 129, 0.12)',
        glow: '0 4px 20px rgba(16, 185, 129, 0.25)',
        nav: '0 4px 24px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        shimmer: 'shimmer 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.04' },
          '50%': { opacity: '0.07' },
        },
      },
    },
  },
  plugins: [],
}
