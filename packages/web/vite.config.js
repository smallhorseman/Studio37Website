import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@config': path.resolve(__dirname, 'src/config'), // added
    },
  },
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || 'https://sem37-api.onrender.com'),
    'import.meta.env.VITE_AUTH_BASE_URL': JSON.stringify(process.env.VITE_AUTH_BASE_URL || 'https://auth-3778.onrender.com')
  },
  esbuild: {
    jsx: 'automatic', // ensure JSX syntax is allowed if it appears in .js
    jsxDev: process.env.NODE_ENV !== 'production'
  },
  build: {
    sourcemap: true,
    target: 'es2022',
    rollupOptions: {
      external: OPTIONAL_EXTERNALS,
    },
    chunkSizeWarningLimit: 900,
  },
  optimizeDeps: {
    exclude: OPTIONAL_EXTERNALS,
    include: ['lodash'] // added
  },
  server: {
    proxy: {
      // Ensure target services send proper CORS headers if accessed directly.
      // Frontend has fallback to these relative paths when remote CORS blocks.
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'https://sem37-api.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: p => p,
      },
      '/auth': {
        target: process.env.VITE_AUTH_PROXY_TARGET || 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
        rewrite: p => p,
      },
    },
  },
});

// Lean rebuild note: auth/tools proxies retained; remove if not needed in minimal mode.
