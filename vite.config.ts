import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      publicDir: path.resolve(__dirname, 'frontend/public'),
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'frontend/src'),
          'next/link': path.resolve(__dirname, 'frontend/src/compat/Link.tsx'),
          'next/image': path.resolve(__dirname, 'frontend/src/compat/Image.tsx'),
          'next/navigation': path.resolve(__dirname, 'frontend/src/compat/Navigation.tsx'),
          'next/font/google': path.resolve(__dirname, 'frontend/src/compat/Fonts.tsx'),
          'next': path.resolve(__dirname, 'frontend/src/compat/Next.tsx'),
        }
      }
    };
});
