import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // This maps the specific broken string directly to the installed package
      "sonner@2.0.3": path.resolve(__dirname, 'node_modules/sonner'),
      "sonner": path.resolve(__dirname, 'node_modules/sonner'),
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1600,
  },
});