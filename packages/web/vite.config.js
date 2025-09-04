import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Variables for external dependencies
const OPTIONAL_EXTERNALS = [];

// Simplified config focused on essential functionality
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    'import.meta.env.VITE_PACKAGES_ENDPOINT': JSON.stringify(process.env.VITE_PACKAGES_ENDPOINT || ''),
    'import.meta.env.VITE_SERVICES_ENDPOINT': JSON.stringify(process.env.VITE_SERVICES_ENDPOINT || ''), // added
    'import.meta.env.VITE_ENABLE_API_SHIM': JSON.stringify(
      process.env.VITE_ENABLE_API_SHIM === undefined ? '1' : process.env.VITE_ENABLE_API_SHIM
    ),
    'import.meta.env.VITE_API_SHIM_DEBUG': JSON.stringify(process.env.VITE_API_SHIM_DEBUG || ''),
    'import.meta.env.VITE_PROJECTS_ENDPOINT': JSON.stringify(process.env.VITE_PROJECTS_ENDPOINT || '')
  },
  esbuild: {
    jsx: 'automatic',
    jsxDev: process.env.NODE_ENV !== 'production'
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
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
        // Dev-only proxy; production uses /public/_redirects for /api/*
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
  css: {
    // Remove explicit PostCSS configuration to prevent conflicts
    // Let Vite use the tailwind.config.js file directly
    devSourcemap: true
  }
});

