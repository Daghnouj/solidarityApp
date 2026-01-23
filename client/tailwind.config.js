/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
       fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        solidarity: {
          blue: '#4FB2E5',
          orange: '#F5A146',
          pink: '#FF90BC',
        },
      },
    },
  },
  plugins: [],
}
