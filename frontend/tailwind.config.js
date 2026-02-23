/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'message-in': 'messageIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        messageIn: {
          '0%': { transform: 'translateY(12px) scale(0.96)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        }
      },
      maxWidth: {
        'chat': '48rem',
      },
      fontSize: {
        'sm': ['0.9375rem', { lineHeight: '1.6' }],
        'base': ['1rem', { lineHeight: '1.7' }],
      }
    },
  },
  plugins: [],
}
