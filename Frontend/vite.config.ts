import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Performance: Use SWC for faster builds
      jsxRuntime: 'automatic',
      // Optimize React refresh for development
      fastRefresh: true,
      // Babel optimizations
      babel: {
        presets: [
          ['@babel/preset-env', {
            modules: false,
            useBuiltIns: 'usage',
            corejs: 3
          }]
        ],
        compact: true
      }
    }),
  ],
  
  // Security configurations
  server: {
    https: false,
    host: true,
    port: 5173,
    strictPort: true,
    // Performance: Enable HTTP/2 and compression
    middlewareMode: false,
    hmr: {
      port: 5173
    },
    headers: {
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

  // Build configuration with performance optimizations
  build: {
    target: 'es2020', // More modern target for better performance
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    
    // Performance optimizations
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // Inline small assets
    emptyOutDir: true,
    
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.warn', 'console.error'],
        passes: 3 // Multiple passes for better compression
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_/
        }
      },
      format: {
        comments: false
      }
    },
    
    rollupOptions: {
      output: {
        // Security: Obfuscate chunk names
        chunkFileNames: 'assets/js/[hash].js',
        entryFileNames: 'assets/js/[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          let extType = info[info.length - 1];
          
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name ?? '')) {
            extType = 'img';
          } else if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name ?? '')) {
            extType = 'fonts';
          }
          
          return `assets/${extType}/[hash].[ext]`;
        },
        
        // Advanced chunk splitting for better caching
        manualChunks: (id) => {
          // Vendor chunk for core libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          
          // Router chunk
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          
          // UI library chunk
          if (id.includes('node_modules/lucide-react') || 
              id.includes('node_modules/react-hot-toast') ||
              id.includes('node_modules/swiper')) {
            return 'ui-vendor';
          }
          
          // Utils chunk
          if (id.includes('node_modules/axios') || 
              id.includes('node_modules/date-fns') ||
              id.includes('node_modules/validator')) {
            return 'utils-vendor';
          }
          
          // Form handling chunk
          if (id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/@hookform') ||
              id.includes('node_modules/yup')) {
            return 'forms-vendor';
          }
          
          // State management chunk
          if (id.includes('node_modules/zustand') ||
              id.includes('node_modules/react-query')) {
            return 'state-vendor';
          }
          
          // Large node_modules packages
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          
          // App-specific chunks
          if (id.includes('/pages/')) {
            return 'pages';
          }
          
          if (id.includes('/components/')) {
            return 'components';
          }
          
          if (id.includes('/services/') || id.includes('/utils/')) {
            return 'services';
          }
        }
      },
      
      // Performance: Tree-shaking optimizations
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false
      }
    },
    
    // Performance: Parallel processing
    chunkSizeWarningLimit: 1000,
    
    // Performance: Compression
    reportCompressedSize: true,
    
    // Performance: CSS optimization
    cssMinify: 'lightningcss'
  },

  // Environment variable configuration
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    // Remove development-only code
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
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
    devSourcemap: false,
    modules: {
      generateScopedName: process.env.NODE_ENV === 'production' ? '[hash:base64:5]' : '[local]_[hash:base64:5]'
    },
    preprocessorOptions: {
      // Optimize CSS preprocessing
      scss: {
        charset: false
      }
    }
  },

  // Preview configuration
  preview: {
    port: 4173,
    strictPort: true,
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.boholtraveltips.com; media-src 'self'; object-src 'none'; frame-src 'none';",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  },

  // Performance: Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'react-hot-toast',
      'lucide-react',
      'date-fns',
      'validator',
      'react-hook-form',
      'yup',
      'zustand'
    ],
    exclude: [
      '@vite/client',
      '@vite/env'
    ],
    // Performance: Use esbuild for deps optimization
    esbuildOptions: {
      target: 'es2020'
    }
  },

  // Performance: Enable experimental features
  experimental: {
    renderBuiltUrl: (filename) => {
      // Use CDN for assets in production
      if (process.env.NODE_ENV === 'production' && process.env.VITE_CDN_URL) {
        return `${process.env.VITE_CDN_URL}/${filename}`;
      }
      return `/${filename}`;
    }
  },

  // Worker configuration
  worker: {
    format: 'es',
    plugins: [react()]
  },

  // JSON configuration for faster parsing
  json: {
    stringify: true
  },

  // ESBuild configuration for faster builds
  esbuild: {
    target: 'es2020',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none'
  }
});
