import { createRequire } from 'module';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const require = createRequire(import.meta.url);
const isProd = process.env.NODE_ENV === 'production';

function safeRequire(id) {
  try {
    return require(id);
  } catch {
    return null;
  }
}

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
