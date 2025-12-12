// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'african-gold': '#D4A017',
        'tech-teal': '#00B6A1',
        'deep-charcoal': '#0D0D0D',
        'soft-ivory': '#F7F6F3',
        'text-gray': '#5A5A5A',
        'pure-white': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
      },
      maxWidth: {
        '8xl': '1200px',
      }
    },
  },
  plugins: [],
}