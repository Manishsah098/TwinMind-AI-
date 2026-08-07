/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#ecfeff',
          100: '#cffaff',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        dark: {
          950: '#030712',
          900: '#0b0f19',
          850: '#111726',
          800: '#1a2336',
          750: '#222e47',
          700: '#2d3d5e',
        }
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.15) 0%, transparent 60%)',
        'radial-purple': 'radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.12) 0%, transparent 50%)',
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M0 0h32v1H0zm0 31h32v1H0zM0 0v32h1V0zm31 0v32h1V0z'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'glow-cyan': '0 0 30px -5px rgba(6, 182, 212, 0.4)',
        'glow-indigo': '0 0 30px -5px rgba(99, 102, 241, 0.4)',
        'glow-purple': '0 0 30px -5px rgba(168, 85, 247, 0.4)',
        'glow-emerald': '0 0 30px -5px rgba(16, 185, 129, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-hover': '0 12px 40px 0 rgba(6, 182, 212, 0.15)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
