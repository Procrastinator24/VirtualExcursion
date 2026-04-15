import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@app': path.resolve(__dirname, './src/app'),
      '@app/api': path.resolve(__dirname, './src/app/api'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@shared/ui': path.resolve(__dirname, './src/shared/ui'),
      '@shared/lib': path.resolve(__dirname, './src/shared/lib'),
      '@widgets': path.resolve(__dirname, './src/widgets'),
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5209',
        changeOrigin: true,
      },
      '/models': {
        target: 'http://localhost:5209',
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Проксируем:', req.url, '→', proxyReq.path);
          });

        },
      },
    }}})