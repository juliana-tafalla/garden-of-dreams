/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
  "./src/json-data/guide-sprites.json"],
  theme: {
    extend: {
      fontFamily: {
        stardos: ['Stardos Stencil', 'system-ui'],
        sansita: ['Sansita', 'sans-serif']
      }
    },
  },
  plugins: [],
}