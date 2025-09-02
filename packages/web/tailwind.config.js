/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'vintage-cream': '#FFFDF6',
        'soft-charcoal': '#36454F',
        'warm-tan': '#D2B48C',
        'faded-teal': '#468289',
      },
      fontFamily: {
        sans: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        handwriting: ['"Gochi Hand"', 'cursive'],
      },
    },
  },
  plugins: [],
}
