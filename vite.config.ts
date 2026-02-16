import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      // ... keep your existing aliases
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist', // Changed from 'build' to 'dist' for better Vercel compatibility
    chunkSizeWarningLimit: 1600, // Fixes the "chunk size" warning
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Groups heavy libraries together
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