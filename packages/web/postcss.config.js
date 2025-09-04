// For Tailwind CSS v4, we need to use a different approach:
// Using autoprefixer directly alongside tailwindcss
export default {
  plugins: {
    'tailwindcss/postcss': {}, // Use the internal postcss plugin
    'autoprefixer': {}
  }
};
