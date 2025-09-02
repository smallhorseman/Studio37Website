import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

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
  },
  server: {
    proxy: {
      // Existing API proxy (adjust target via env if needed)
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'https://sem37-api.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: p => p, // explicit
      },
      // New Auth proxy (for local dev; adjust target as needed)
      '/auth': {
        target: process.env.VITE_AUTH_PROXY_TARGET || 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
        rewrite: p => p,
      },
    },
  },
});
