const path = require('path')

const baseConfig = require('@financial-app/tailwind-config')

const uiDir = path.dirname(
  require.resolve('@financial-app/ui/package.json')
)

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: [
    path.join(uiDir, 'src/**/*.web.tsx'),
    path.join(uiDir, 'src/variants/**/*.ts'),
    './src/**/*.{ts,tsx}',
    './.storybook/**/*.{ts,tsx}',
  ],
}
