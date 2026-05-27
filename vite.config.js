import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import PrimeVue from 'primevue/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api/image': {
        target: 'https://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'https://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
