/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef4fb', 100: '#dbe8f7', 200: '#b9d2ee', 300: '#8db3e1',
          400: '#5c8fd0', 500: '#3a6fb8', 600: '#2b5799', 700: '#24457a',
          800: '#1f3a63', 900: '#12294a', 950: '#0b1d37',
        },
        saffron: {
          50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
          400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c',
          800: '#9a3412', 900: '#7c2d12',
        },
        india: { green: { 500: '#15803d', 600: '#166534' } },
        canvas: '#f5f7fb',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Noto Sans', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,.05), 0 8px 24px -12px rgba(15,23,42,.12)',
        pop: '0 12px 40px -12px rgba(11,29,55,.28)',
        glow: '0 0 0 1px rgba(58,111,184,.12), 0 8px 30px -8px rgba(58,111,184,.35)',
      },
      borderRadius: { '2.5xl': '1.25rem' },
      keyframes: {
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        dashmove: { to: { strokeDashoffset: '-28' } },
        floaty: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        pingSoft: { '0%': { transform: 'scale(1)', opacity: '.55' }, '80%,100%': { transform: 'scale(2.2)', opacity: '0' } },
      },
      animation: {
        fadeUp: 'fadeUp .5s ease both',
        dashmove: 'dashmove 1.4s linear infinite',
        floaty: 'floaty 5s ease-in-out infinite',
        pingSoft: 'pingSoft 2.2s cubic-bezier(0,0,.2,1) infinite',
      },
    },
  },
  plugins: [],
}
