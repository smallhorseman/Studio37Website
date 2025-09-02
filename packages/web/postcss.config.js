import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
// import nesting from 'postcss-nesting';
// import cssnano from 'cssnano';

export default {
  plugins: [
    // nesting,
    tailwindcss,
    autoprefixer,
    // ...(process.env.NODE_ENV === 'production' ? [cssnano({ preset: 'default' })] : [])
  ],
};
