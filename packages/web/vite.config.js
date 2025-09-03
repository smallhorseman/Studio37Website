import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Optional externals (can stay empty or list modules not to bundle)
const OPTIONAL_EXTERNALS = ['@netlify/blobs'];

export default defineConfig({
  base: '/', // ensure absolute asset paths for Netlify
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@config': path.resolve(__dirname, 'src/config'),
    },
  },
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || 'https://sem37-api.onrender.com'),
    'import.meta.env.VITE_AUTH_BASE_URL': JSON.stringify(process.env.VITE_AUTH_BASE_URL || 'https://auth-3778.onrender.com'),
    'import.meta.env.VITE_ALLOW_PROD_RELATIVE': JSON.stringify(
      process.env.VITE_ALLOW_PROD_RELATIVE === undefined
        ? '1'           // default ON to allow /api fallback for CORS while backend is fixed
        : process.env.VITE_ALLOW_PROD_RELATIVE
    ),
    'import.meta.env.VITE_PACKAGES_ENDPOINT': JSON.stringify(process.env.VITE_PACKAGES_ENDPOINT || ''),
    'import.meta.env.VITE_SERVICES_ENDPOINT': JSON.stringify(process.env.VITE_SERVICES_ENDPOINT || ''), // added
    'import.meta.env.VITE_ENABLE_API_SHIM': JSON.stringify(
      process.env.VITE_ENABLE_API_SHIM === undefined ? '1' : process.env.VITE_ENABLE_API_SHIM
    ),
    'import.meta.env.VITE_API_SHIM_DEBUG': JSON.stringify(process.env.VITE_API_SHIM_DEBUG || ''),
  },
  esbuild: {
    jsx: 'automatic',
    jsxDev: process.env.NODE_ENV !== 'production'
  },
  build: {
    sourcemap: process.env.NODE_ENV !== 'production',
    target: 'es2022',
    rollupOptions: {
      external: OPTIONAL_EXTERNALS,
    },
    chunkSizeWarningLimit: 900,
  },
  optimizeDeps: {
    exclude: OPTIONAL_EXTERNALS,
  },
  server: {
    proxy: {
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
