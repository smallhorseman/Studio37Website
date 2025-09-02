import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
// If you use postcss-import, postcss-nesting, cssnano, import them here:
// import postcssImport from 'postcss-import';
// import nesting from 'postcss-nesting';
// import cssnano from 'cssnano';

export default {
  plugins: [
    // Uncomment if you use these plugins:
    // postcssImport && postcssImport(),
    // nesting && nesting(),
    tailwindcss(),
    autoprefixer(),
    // cssnano,
  ].filter(Boolean),
};
