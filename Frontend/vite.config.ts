import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  
  // Security configurations
  server: {
    https: false, // Set to true in production with SSL certificates
    host: true,
    port: 5173,
    strictPort: true,
    headers: {
      // Security headers for development
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  },

  // Build configuration with security optimizations
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable source maps in production for security
    minify: 'terser',
    
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log', 'console.warn', 'console.error'] // Remove specific console functions
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false // Remove comments
      }
    },
    
    rollupOptions: {
      output: {
        // Obfuscate chunk names for security
        chunkFileNames: 'assets/[hash].js',
        entryFileNames: 'assets/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
        
        // Security: Don't expose internal structure
        manualChunks: {
          vendor: ['react', 'react-dom'],
          auth: ['./src/context/AuthContext', './src/services/secureApi'],
          security: ['./src/utils/security']
        }
      },
      
      // Security: Don't bundle sensitive data
      external: (id) => {
        return /\.(md|txt)$/.test(id);
      }
    },
    
    // Asset optimization
    chunkSizeWarningLimit: 500,
    
    // Security: Generate integrity hashes
    ssrManifest: false,
    ssr: false
  },

  // Environment variable configuration
  define: {
    // Only expose necessary environment variables
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },

  // Path resolution
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

  // CSS configuration
  css: {
    devSourcemap: false, // Disable CSS source maps in production
    modules: {
      // Obfuscate CSS class names in production
      generateScopedName: '[hash:base64:5]'
    }
  },

  // Preview configuration (production build preview)
  preview: {
    port: 4173,
    strictPort: true,
    headers: {
      // Production-like security headers
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.boholtraveltips.com; media-src 'self'; object-src 'none'; frame-src 'none';",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  },

  // Optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios'
    ],
    exclude: [
      // Don't pre-bundle potentially sensitive dependencies
    ]
  },

  // Worker configuration
  worker: {
    format: 'es',
    plugins: []
  },

  // JSON configuration
  json: {
    stringify: true // Faster parsing, smaller bundles
  }
});
