import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./frontend/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'whatsapp-green': '#10b981',
        'whatsapp-green-hover': '#059669',
        'whatsapp-teal-green': '#0f766e',
        'whatsapp-light-green': '#d1fae5',
        'whatsapp-blue': '#0ea5e9',
        'whatsapp-gold': '#f59e0b',
        'commerce-gold': '#d97706',
        'dark-bg': '#0e0e11',
        'dark-card': '#16161a',
        'dark-surface-elevated': '#1f1f25',
        'dark-border': '#2a2a32',
        'dark-border-subtle': '#202028',
        'dark-text-primary': '#f4f4f6',
        'dark-text-secondary': '#9d9da8',
        'dark-text-muted': '#6b6b78',
        'dark-input': '#121216',
      },
       keyframes: {
        'toast-in-right': {
          'from': { transform: 'translateX(100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        'toast-in-left': {
          'from': { transform: 'translateX(-100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        'toast-out': {
          'from': { transform: 'translateX(0)', opacity: '1' },
          'to': { transform: 'translateX(120%)', opacity: '0' },
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'toast-in-right': 'toast-in-right 0.5s ease-out forwards',
        'toast-in-left': 'toast-in-left 0.5s ease-out forwards',
        'toast-out': 'toast-out 0.5s ease-in forwards',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
      },
      fontFamily: {
         sans: ['Tajawal', 'sans-serif'],
      }
    }
  },
  plugins: [],
};
export default config;
