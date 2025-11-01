import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],

  // Critical: Set base path for assets
  base: '/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',

    // Generate manifest for asset tracking
    manifest: true,

    // Ensure chunks are properly named
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', '@tanstack/react-query'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
        // Consistent naming
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },

    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,

    // Source maps for debugging (disable in production if needed)
    sourcemap: false,

    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  server: {
    port: 3001,
    host: '0.0.0.0',
  },

  preview: {
    port: 3001,
  },
})
