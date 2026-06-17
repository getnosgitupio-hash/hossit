/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'hoisst-mint':       '#0ccca8',
        'hoisst-mint-dark':  '#089b80',
        'hoisst-mint-deep':  '#054a3c',
        'hoisst-navy':       '#0c3060',
        'hoisst-navy-deep':  '#091f42',
        'hoisst-paper':      '#fafaf2',
        'hoisst-cream':      '#f5f1e8',
        'hoisst-ink':        '#0a0a0a',
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        serif:   ['"Instrument Serif"', 'Georgia', 'serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
