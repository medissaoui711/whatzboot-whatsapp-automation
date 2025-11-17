import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  // FIX: Replaced `process.cwd()` with `'.'` to resolve a TypeScript error.
  // The relative path `'.'` correctly points to the project root where .env files are located.
  const env = loadEnv(mode, '.', '');
  return {
    base: './',
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Further split vendor code to reduce large chunk sizes
            if (id.includes('node_modules')) {
              // Isolate the largest dependencies into their own chunks
              if (id.includes('recharts')) {
                return 'vendor-recharts';
              }
              if (id.includes('react-router-dom') || id.includes('react-router')) {
                return 'vendor-router';
              }
              if (id.includes('react-dom')) {
                return 'vendor-react-dom';
              }
              if (id.includes('react')) {
                return 'vendor-react';
              }
              // Group other smaller libraries together
              return 'vendor-other';
            }
            // Group common UI components into a separate chunk
            if (id.includes('components/ui')) {
                return 'ui-kit';
            }
          }
        }
      }
    },
    define: {
      // Vercel provides the API_KEY as an environment variable.
      // This makes it available to the client-side code.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})