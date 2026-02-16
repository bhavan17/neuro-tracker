import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      // This maps any Figma export versioning back to the actual installed package
      'sonner': path.resolve(__dirname, 'node_modules/sonner'),
      'lucide-react': path.resolve(__dirname, 'node_modules/lucide-react'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist', 
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});