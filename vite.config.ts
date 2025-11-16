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
    plugins: [react()],
    define: {
      // Vercel provides the API_KEY as an environment variable.
      // This makes it available to the client-side code.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})