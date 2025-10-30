import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Server configuration for development
  server: {
    port: 3001,
    // Exposes the server to the local network for testing on other devices
    host: '0.0.0.0',
  },

  // List of Vite plugins. @vitejs/plugin-react enables React Fast Refresh.
  plugins: [react()],

  // Specifies the directory for static assets. 'public' is the default.
  publicDir: 'public',

  // REASON: The 'define' block was removed.
  // CRITICAL: Secret API keys like GEMINI_API_KEY must NOT be exposed to the client.
  // They should be used in a secure backend or a serverless function.
  // For non-secret keys (e.g., Supabase URL), prefix them with 'VITE_' in your .env file
  // and access them in your code via `import.meta.env.VITE_YOUR_KEY`.
  // Vite handles this automatically without needing a 'define' block.

  // Path aliases for cleaner imports
  resolve: {
    alias: {
      // REASON: Pointing '@' to the 'src' directory is a common and convenient convention.
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Production build configuration
  build: {
    // REASON: `cssCodeSplit` is now `true` (by default, by removing the line).
    // This allows the browser to only load the CSS needed for the current page,
    // improving initial load performance.
    // REASON: `rollupOptions.output.inlineDynamicImports` has been removed.
    // This RE-ENABLES code-splitting for your JavaScript. This is ESSENTIAL for
    // React.lazy() to work correctly, ensuring small initial bundle sizes and fast
    // load times. The code for different pages will now be loaded on demand.
  },
});
