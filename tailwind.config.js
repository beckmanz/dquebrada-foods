/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#111111',
          card: '#18181b', // zinc-900
          border: '#27272a', // zinc-800
          red: '#E51919',
          redHover: '#cc1414',
          yellow: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        urban: ['"Bebas Neue"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
