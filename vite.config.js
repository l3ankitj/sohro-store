import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 7823,
    open: '/index.html',
    historyApiFallback: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  preview: {
    historyApiFallback: true,
  },
});
