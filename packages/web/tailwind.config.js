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
        handwriting: ['Gochi Hand', 'cursive'],
      },
      colors: {
        'soft-charcoal': '#333333',
        'warm-tan': '#D2B48C',
        'faded-teal': '#6B8E8E',
      },
      screens: {
        '2xl': '1440px'
      }
    },
  },
  plugins: [],
};
