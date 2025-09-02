import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// List any missing / optional runtime-only deps here
const OPTIONAL_EXTERNALS = [
  '@netlify/blobs',
  // add more module ids reported as missing without installing them
];

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      external: OPTIONAL_EXTERNALS,
    },
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
      },
      // New Auth proxy (for local dev; adjust target as needed)
      '/auth': {
        target: process.env.VITE_AUTH_PROXY_TARGET || 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
