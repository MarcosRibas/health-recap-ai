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
          DEFAULT: '#1A7F40',
          light: '#2a9a52',
          dark: '#156634',
        }
      }
    },
  },
  plugins: [],
} 