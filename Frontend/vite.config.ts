import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    })
  ],

  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    cssCodeSplit: true,
    emptyOutDir: true,
    
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[hash].js',
        entryFileNames: 'assets/js/[hash].js',
        assetFileNames: 'assets/[ext]/[hash].[ext]',
        
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui-vendor': ['lucide-react', 'react-hot-toast'],
          'utils-vendor': ['axios', 'date-fns', 'validator'],
          'forms-vendor': ['react-hook-form', 'yup'],
          'state-vendor': ['zustand', 'react-query']
        }
      }
    }
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@services': resolve(__dirname, 'src/services'),
      '@context': resolve(__dirname, 'src/context'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@types': resolve(__dirname, 'src/types')
    }
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'react-hot-toast',
      'lucide-react'
    ]
  }
});
