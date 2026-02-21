import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cabinet)', 'var(--font-sora)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d6fd',
          300: '#a5b8fb',
          400: '#818ef7',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#3730a3',
          800: '#2e2a7a',
          900: '#1e1b5e',
          950: '#13113d',
        },
        surface: {
          DEFAULT: '#0f0f1a',
          card: '#161625',
          elevated: '#1c1c30',
          border: '#2a2a45',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(240,100%,74%,0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(267,100%,76%,0.08) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(224,76%,58%,0.1) 0px, transparent 50%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glow': '0 0 40px rgba(99,102,241,0.15)',
        'glow-sm': '0 0 20px rgba(99,102,241,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
