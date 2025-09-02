import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const isProd = process.env.NODE_ENV === 'production';

// Safe optional loader (won't break if dependency missing)
function optional(importer) {
  try {
    return importer();
  } catch {
    return null;
  }
}

const postcssImport = optional(() => require('postcss-import'));
const nesting = optional(() => require('postcss-nesting'));
const cssnano = optional(() =>
  require('cssnano')({
    preset: ['default', { discardComments: { removeAll: true } }],
  })
);

export default {
  plugins: [
    // Order matters
    postcssImport && postcssImport(),
    nesting && nesting(),
    tailwindcss(),
    autoprefixer(),
    isProd && cssnano,
  ].filter(Boolean),
};
