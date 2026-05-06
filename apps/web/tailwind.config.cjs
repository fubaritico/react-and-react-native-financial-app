const baseConfig = require('@financial-app/tailwind-config')
const containerQueries = require('@tailwindcss/container-queries')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  plugins: [...(baseConfig.plugins || []), containerQueries],
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/ui/src/components/**/*.{web.tsx,variants.ts,styles.ts,constants.ts}',
    '../../packages/ui/src/lib/**/*.ts',
    '../../packages/features/src/**/*.{web.tsx,styles.ts}',
  ],
}
