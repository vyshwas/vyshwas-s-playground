import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Split the heavy vendors out of the entry chunk so first paint is not
        // blocked by the WebGL/physics payload, and so they cache independently
        // across deploys.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('three')) return 'three'
          if (id.includes('matter-js')) return 'matter'
          if (id.includes('gsap')) return 'gsap'
          if (id.includes('react')) return 'react'
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
})
