module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'ui-sans-serif', 'system-ui'],
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
      animation: {
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  safelist: [
    // Colors for channels
    {
      pattern: /(bg|text)-(emerald|blue|purple)-(50|100|300|400|600|800)/,
      variants: ['hover', 'dark', 'dark:hover'],
    },
    {
      pattern: /(bg)-(emerald|blue|purple)-(800|900)\/(\d+)/,
      variants: ['dark'],
    },
  ],
  plugins: [],
};