import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3002,
    proxy: {
      // FastAPI (recursos: pistas, reservas, etc.)
      '/api/fastapi': {
        target: process.env.FASTAPI_INTERNAL_URL || 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fastapi/, '')
      },
      // SpringBoot (auth + usuarios)
      // Peticiones /api/springboot/... → http://springboot:8080/api/...
      // La cookie queda bajo localhost:3002, no bajo localhost:8080
      '/api/springboot': {
        target: process.env.SPRINGBOOT_INTERNAL_URL || 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/springboot/, '/api')
      }
    }
  }
})
