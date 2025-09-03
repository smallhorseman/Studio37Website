import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Custom plugin to remove unsupported / noisy vendor declarations
const stripInvalidVendors = () => ({
  postcssPlugin: 'strip-invalid-vendors',
  Declaration(decl) {
    if (decl.prop === '-moz-column-gap') {
      decl.remove();
    }
    if (decl.prop === '-webkit-text-size-adjust' &&
        !['100%', 'none', 'auto'].includes(decl.value.trim())) {
      // Remove odd value that causes parsing warnings
      decl.remove();
    }
  }
});
stripInvalidVendors.postcss = true;

export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
    stripInvalidVendors()
  ]
};
