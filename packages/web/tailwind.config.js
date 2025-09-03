/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'vintage-cream': '#FFFDF6',
        'soft-charcoal': '#36454F',
        'faded-teal': '#468289'
      },
      fontFamily: {
        sans: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        handwriting: ['"Gochi Hand"', 'cursive']
      },
      container: {
        center: true,
        padding: '1rem'
      },
      screens: {
        '2xl': '1440px'
      }
    }
  },
  plugins: []
};
