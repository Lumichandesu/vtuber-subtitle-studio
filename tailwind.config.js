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
        paper: 'var(--paper)',
        surface: 'var(--surface)',
        sunken: 'var(--sunken)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        'line-strong': 'var(--line-strong)',
        yblue: { DEFAULT: '#67A2D8', soft: 'var(--blue-soft)', deep: 'var(--blue-deep)' },
        ypink: { DEFAULT: '#F8B7CC', soft: 'var(--pink-soft)' },
        ysand: { DEFAULT: '#EDD7AA', soft: 'var(--sand-soft)' },
        ymint: '#C8E6D8',
        ok: 'var(--ok)',
        warn: 'var(--warn)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        sans: ['Kanit', '"Noto Sans Thai"', '"Leelawadee UI"', '"Yu Gothic UI"', 'Meiryo', '"Noto Sans JP"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', '"Cascadia Mono"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
