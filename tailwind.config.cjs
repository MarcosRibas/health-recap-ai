/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4ea1c2',
          light: '#6ab3d1',
          dark: '#3c89a7',
        }
      }
    },
  },
  plugins: [],
} 