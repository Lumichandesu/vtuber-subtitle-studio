/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src-ui/**/*.{js,ts,jsx,tsx}",
    "./src-server/public/**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        anime: {
          dark: '#0d1117',
          card: 'rgba(22, 27, 34, 0.85)',
          pink: '#ff79c6',
          cyan: '#8be9fd',
          purple: '#bd93f9',
          yellow: '#f1fa8c',
          green: '#50fa7b',
          border: 'rgba(255, 121, 198, 0.25)',
          glow: 'rgba(139, 233, 253, 0.4)',
        }
      },
      fontFamily: {
        japanese: ['"Noto Sans JP"', '"M PLUS Rounded 1c"', 'sans-serif'],
        thai: ['"Prompt"', '"Sarabun"', 'sans-serif'],
        english: ['"Outfit"', '"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'neon-pink': '0 0 15px rgba(255, 121, 198, 0.5)',
        'neon-cyan': '0 0 15px rgba(139, 233, 253, 0.5)',
        'neon-purple': '0 0 20px rgba(189, 147, 249, 0.4)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
