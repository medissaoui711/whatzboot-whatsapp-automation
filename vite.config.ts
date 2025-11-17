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
            if (id.includes('node_modules')) {
              // Group all recharts-related modules into a single chunk
              if (id.includes('recharts')) {
                return 'recharts';
              }
              // Group all react-related modules into a single chunk
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'react-vendor';
              }
              // Group all other vendor modules into a separate chunk
              return 'vendor';
            }
          },
        },
      },
    },
    define: {
      // Vercel provides the API_KEY as an environment variable.
      // This makes it available to the client-side code.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})