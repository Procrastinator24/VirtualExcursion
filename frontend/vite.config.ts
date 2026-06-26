import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from "@tailwindcss/vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@app/api': path.resolve(__dirname, './src/app/api'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@shared/ui': path.resolve(__dirname, './src/shared/ui'),
      '@shared/lib': path.resolve(__dirname, './src/shared/lib'),
     
    },
  },
  

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5209',
        changeOrigin: true,
      },
      '^/models/.*\\.fbx': {
        target: 'http://localhost:5209',
        changeOrigin: true,
      },
      '/models': {
        target: 'http://localhost:5209',
        changeOrigin: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Проксируем:', req.url, '→', proxyReq.path);
           
          });

        },
      },
    }},
  optimizeDeps: {
    include: ['models/*.fbx'], // Не обязательно, но может помочь
    },
    assetsInclude: ['**/*.fbx'], // 🔥 Говорим Vite обрабатывать .fbx как ассеты
});