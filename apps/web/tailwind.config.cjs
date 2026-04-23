const baseConfig = require('@financial-app/tailwind-config')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/ui/src/components/**/*.{web.tsx,variants.ts,styles.ts}',
    '../../packages/ui/src/lib/**/*.ts',
  ],
}
