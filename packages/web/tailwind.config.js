/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-faded-teal','text-faded-teal','border-faded-teal',
    'bg-soft-charcoal','text-soft-charcoal',
    'dark','dark:bg-soft-charcoal','dark:text-vintage-cream',
    'btn','btn-primary','btn-outline','btn-danger'
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
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1200px',
          '2xl': '1440px',
        },
      },
    },
  },
  plugins: [
    // require('@tailwindcss/aspect-ratio'),
  ],
}
