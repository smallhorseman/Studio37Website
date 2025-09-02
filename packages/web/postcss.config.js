import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Removed duplicate export default block to fix multiple default exports error.

const postcssImport = safeRequire('postcss-import');
const nesting = safeRequire('postcss-nesting');
const cssnano = isProd
  ? safeRequire('cssnano')?.({
      preset: ['default', { discardComments: { removeAll: true } }],
    })
  : null;

export default {
  plugins: [
    postcssImport && postcssImport(),
    nesting && nesting(),
    tailwindcss(),
    autoprefixer(),
    cssnano,
  ].filter(Boolean),
};
