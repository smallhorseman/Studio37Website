/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'vintage-cream': '#FFFDF6',
        'soft-charcoal': '#36454F',
        'faded-teal': '#468289',
        'warm-tan': '#D2B48C'
      },
      fontFamily: {
        'sans': ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        'serif': ['Georgia', 'serif'],
        'handwriting': ['"Gochi Hand"', 'cursive']
      }
    }
  },
  plugins: []
}
