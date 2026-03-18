import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Ensure large media files are NOT inlined as Base64 in the JS code
    assetsInlineLimit: 0, 
    // Optimization for large projects
    chunkSizeWarningLimit: 2000,
    // Use esbuild for minification (default and fastest)
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})
