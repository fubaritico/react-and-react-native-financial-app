const path = require('path')

const baseConfig = require('@financial-app/tailwind-config')

const uiDir = path.dirname(
  require.resolve('@financial-app/ui/package.json')
)
const featuresDir = path.resolve(__dirname, '../../packages/features')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    path.join(uiDir, 'src/components/**/*.{web.tsx,variants.ts,styles.ts}'),
    path.join(uiDir, 'src/lib/**/*.ts'),
    path.join(featuresDir, 'src/**/*.{web.tsx,styles.ts}'),
    './src/**/*.{ts,tsx}',
    './.storybook/**/*.{ts,tsx}',
  ],
}
