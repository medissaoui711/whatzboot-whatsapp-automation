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
            // Group all node_modules into vendor chunks.
            // This prevents large vendor libraries from being bundled with application code.
            if (id.includes('node_modules')) {
              // Create a separate, large chunk for recharts to isolate it.
              if (id.includes('recharts')) {
                return 'vendor-recharts';
              }
              // All other vendors go into a core vendor bundle.
              return 'vendor-core';
            }
            // Group common UI components into a separate chunk as they are used across many pages.
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
