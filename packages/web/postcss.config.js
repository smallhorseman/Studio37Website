import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Custom plugin to remove/normalize unsupported vendor declarations
const stripInvalidVendors = () => ({
  postcssPlugin: 'strip-invalid-vendors',
  Declaration(decl) {
    if (decl.prop === '-moz-column-gap') {
      decl.remove();
      return;
    }
    if (decl.prop === '-webkit-text-size-adjust') {
      // Normalize any value to 'auto' (widely accepted) to avoid parse errors
      decl.value = 'auto';
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
