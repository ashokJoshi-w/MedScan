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
          50: '#F0FDF9',
          100: '#CCFBEF',
          500: '#0D9488',
          600: '#0F766E',
          700: '#115E59',
        },
        ink: {
          DEFAULT: '#0F172A',
          muted: '#475569',
          faint: '#94A3B8',
        },
        surface: '#F8FAFB',
        background: '#F8FAFB',
        border: '#E2E8F0',
        muted: '#64748B',
        danger: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
        accent: {
          violet: '#7C3AED',
          blue: '#3B82F6',
          rose: '#F43F5E',
          amber: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        elevated: '0 4px 24px rgba(0,0,0,0.08)',
        glow: '0 0 40px rgba(29, 158, 117, 0.15)',
        'glow-lg': '0 0 80px rgba(29, 158, 117, 0.2)',
        glass: '0 8px 32px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      backgroundImage: {
        'mesh': 'radial-gradient(at 40% 20%, rgba(29,158,117,0.25) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(124,58,237,0.15) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(59,130,246,0.12) 0px, transparent 50%)',
        'hero-dark': 'linear-gradient(135deg, #085041 0%, #0F172A 50%, #1e1b4b 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'gradient': 'gradientShift 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
