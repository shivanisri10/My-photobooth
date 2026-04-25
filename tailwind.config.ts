import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FFE9F1',
          100: '#FFD6E7',
          200: '#F8BBD0',
          300: '#F48FB1',
          400: '#F06292',
        },
        lavender: {
          100: '#F3EEFF',
          200: '#E6D6FF',
          300: '#DCC6FF',
          400: '#C9A8FF',
        },
        cream: '#FFFAF5',
      },
      fontFamily: {
        script: ['Dancing Script', 'cursive'],
        body: ['DM Sans', 'sans-serif'],
      },
      keyframes: {
        stripDrop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '70%': { transform: 'translateY(8px)' },
          '85%': { transform: 'translateY(-4px)' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        flash: {
          '0%': { opacity: '0' },
          '50%': { opacity: '0.9' },
          '100%': { opacity: '0' },
        },
        fadeScale: {
          '0%': { opacity: '0', transform: 'scale(1.3)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        }
      },
      animation: {
        stripDrop: 'stripDrop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        flash: 'flash 0.4s ease-out forwards',
        fadeScale: 'fadeScale 0.3s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
      }
    },
  },
  plugins: [],
}
export default config
