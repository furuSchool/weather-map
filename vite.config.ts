import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Flask で配信するためのフォルダ
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // Flaskサーバー
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
