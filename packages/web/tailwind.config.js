/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
        handwriting: ['Kalam', 'cursive'],
      },
      colors: {
        'vintage-cream': '#F8F4E9',
        'faded-teal': '#5E8B8D',
        'warm-tan': '#D2B48C',
        'soft-charcoal': '#36454F',
      },
    },
  },
  plugins: [],
}