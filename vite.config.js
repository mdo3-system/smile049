import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Xserver等の静的ホスティングに適した相対パス設定
  server: {
    port: 3000,
    open: true
  }
});
