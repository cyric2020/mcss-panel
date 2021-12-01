import { defineConfig } from 'vite'
const { resolve } = require('path')
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  root: './',
  build: {
    ourDir: './dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        server: resolve(__dirname, 'server.html'),
        // main: new URL('./index.html', import.meta.url).pathname,
        // dashboard: new URL('./dashboard.html', import.meta.url).pathname,
        // server: new URL('./server.html', import.meta.url).pathname,
      },
    },
  },
})
