/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Thêm dòng này!
  theme: {
    extend: {},
  },
  plugins: [],
}