import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        constitution: resolve(import.meta.dirname, 'constitution/index.html'),
        perspective: resolve(import.meta.dirname, 'perspectives/personal-superintelligence-for-everyone/index.html'),
      },
    },
  },
})
