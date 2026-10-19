import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy backend API routes to Node/Express server on port 5000
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Proxy N2YO satellite queries if needed
      '/n2yo': {
        target: 'https://api.n2yo.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/n2yo/, ''),
      },
    },
  },
})