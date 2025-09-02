import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

(function checkNodeVersion() {
  const major = parseInt(process.versions.node.split('.')[0], 10);
  const supported = [18, 20];
  if (!supported.includes(major)) {
    // Non‑fatal warning to help Netlify logs
    // eslint-disable-next-line no-console
    console.warn(
      `[build] Detected Node ${process.versions.node}. Recommended LTS versions: 18.x or 20.x. ` +
      `Specify NODE_VERSION in Netlify settings or add an "engines" field in package.json.`
    );
  }
})();

// List any missing / optional runtime-only deps here
const OPTIONAL_EXTERNALS = [
  '@netlify/blobs',
  // add more module ids reported as missing without installing them
];

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@components': path.resolve(__dirname, 'src/components'),
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
      // NOTE: These proxies are LOCAL DEV ONLY. In production the frontend should call
      // the external auth service at VITE_AUTH_BASE_URL (Render deployment of packages/auth).
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
