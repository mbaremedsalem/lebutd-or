/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pitch: {
          DEFAULT: '#0E3B2E',
          dark: '#082821',
          light: '#155440',
        },
        turf: {
          DEFAULT: '#3FA34D',
          light: '#63C574',
        },
        chalk: '#F5F3EC',
        floodlight: '#FFD84D',
        ink: '#0E1512',
        line: '#D9D2BE',
      },
      fontFamily: {
        display: ['"Oswald"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        stitches:
          'repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(255,255,255,0.06) 18px, rgba(255,255,255,0.06) 19px)',
      },
    },
  },
  plugins: [],
};
