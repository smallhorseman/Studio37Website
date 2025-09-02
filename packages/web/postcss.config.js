import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss(),
    autoprefixer()
  ]
};
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
