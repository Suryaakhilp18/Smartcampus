/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Chivo',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        heading: [
          'Chivo',
          'Inter',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          DEFAULT: '#0B2D6B',
          50: '#F0F4FA',
          100: '#DCE6F5',
          200: '#BDCEEB',
          300: '#94AFDD',
          400: '#5F88CA',
          500: '#1D4999',
          600: '#0E3B87',
          700: '#0B2D6B', // Aditya University Primary Navy
          800: '#0A2472', // Aditya Deep Navy Alt
          900: '#061645',
          950: '#030C28',
        },
        accent: {
          DEFAULT: '#F5821F',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F5821F', // Aditya University Vibrant Orange/Coral CTA
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        gold: {
          DEFAULT: '#BE9337',
          300: '#E5C97F',
          400: '#D4AF57',
          500: '#BE9337', // Aditya Logo Gold
          600: '#A37926',
        },
        campus: {
          surface: '#F5F5F5',
          darkSurface: '#07101E',
          cardDark: '#0C1B33',
        }
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(11, 45, 107, 0.12)',
        'glass-lg': '0 20px 60px -10px rgba(11, 45, 107, 0.25)',
        'cta': '0 4px 14px 0 rgba(245, 130, 31, 0.39)',
        'card': '0 4px 20px -2px rgba(11, 45, 107, 0.08)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: 0.7 },
          '80%': { transform: 'scale(1.8)', opacity: 0 },
          '100%': { transform: 'scale(1.8)', opacity: 0 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.24, 0, 0.38, 1) infinite',
        shimmer: 'shimmer 1.5s infinite linear',
      },
    },
  },
  plugins: [],
};
