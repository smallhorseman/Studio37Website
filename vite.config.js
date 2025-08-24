import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url' // Import necessary modules for path aliasing

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add resolve alias configuration to make imports more robust
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
