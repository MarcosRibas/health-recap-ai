/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A7F40',
          light: '#2a9a52',
          dark: '#156634',
        },
        dark: {
          // Fundo principal (mais escuro)
          DEFAULT: '#121212',
          // Cards e containers (quase preto)
          lighter: '#1e1e1e',
          // Barra lateral e elementos secundários
          sidebar: '#262626',
          // Elementos de destaque
          highlight: '#2d2d2d',
          // Campos de input/textarea (mais claro)
          input: '#2d2d2d',
          // Bordas e separadores
          border: '#2d2d2d',
          // Textos
          text: {
            primary: '#ffffff',
            secondary: '#a3a3a3',
            muted: '#737373'
          }
        }
      }
    },
  },
  plugins: [],
} 