import type { Config } from 'tailwindcss'
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: { colors: { navy: '#0b1b3b', success: '#1f8a4c', danger: '#b42318' } } },
  plugins: []
} satisfies Config
