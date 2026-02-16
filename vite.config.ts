import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // This "Catches" the versioned imports so you don't have to edit every file
      'sonner@2.0.3': 'sonner',
      'lucide-react@0.487.0': 'lucide-react',
      'recharts@2.15.2': 'recharts',
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1600,
  },
});