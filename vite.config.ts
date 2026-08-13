import path from 'path';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint2';
import stylelint from 'vite-plugin-stylelint';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    eslint({ lintOnStart: true, emitError: true, emitWarning: true, include: ['src/**/*.{js,jsx,ts,tsx}'] }),
    stylelint({
      include: ['src/**/*.{css,scss,sass,less,postcss}'],
      exclude: ['node_modules', 'dist', 'build'],
      lintOnStart: true,
      emitError: true,
      emitWarning: true,
      fix: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Vite dev-proxy -> бэкенд, обход CORS пока сервер без cors middleware
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
});
