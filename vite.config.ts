import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      // This Regex catches any import ending in @version (like sonner@2.0.3)
      // and redirects it to the base package name.
      { 
        find: /^(.+)@\d+\.\d+\.\d+$/, 
        replacement: '$1' 
      },
    ],
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1600,
  },
});