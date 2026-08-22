import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src-ui'),
      '@server': path.resolve(__dirname, './src-server'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:18890',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://localhost:18890',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist/ui',
    emptyOutDir: true,
  },
});
