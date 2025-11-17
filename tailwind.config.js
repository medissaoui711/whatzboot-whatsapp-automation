
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'whatsapp-green': '#25D366',
        'whatsapp-teal-green': '#128C7E',
        'whatsapp-light-green': '#DCF8C6',
        'whatsapp-blue': '#34B7F1',
        'dark-bg': '#0D1117',
        'dark-card': '#161B22',
        'dark-border': '#30363d',
        'dark-text-primary': '#c9d1d9',
        'dark-text-secondary': '#8b949e',
        'dark-input': '#010409',
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
}
