import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3001,
    proxy: {
      '/api/fastapi': {
        target: 'http://fastapi_server:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fastapi/, '')
      },
      '/api/springboot': {
        target: 'http://springboot_server:6000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/springboot/, '/api')
      }
    }
  }
})
