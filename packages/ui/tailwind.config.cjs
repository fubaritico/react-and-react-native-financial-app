const baseConfig = require('@financial-app/tailwind-config')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    './src/**/*.web.tsx',
    './src/variants/**/*.ts',
    './.storybook/**/*.{ts,tsx}',
  ],
}
