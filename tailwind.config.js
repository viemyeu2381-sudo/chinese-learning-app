/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        hanzi: ['"Noto Sans SC"', '"Source Han Sans SC"', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        },
        surface: {
          light: '#f8fafc',
          card: '#ffffff',
          dark: '#0f172a',
          'card-dark': '#1e293b',
        },
      },
      boxShadow: {
        card: '0 4px 24px -4px rgb(15 23 42 / 0.08)',
        'card-dark': '0 4px 24px -4px rgb(0 0 0 / 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
