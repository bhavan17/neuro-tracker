import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'sonner@2.0.3': 'sonner', // This acts as a backup redirect
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1600,
  },
});