const path = require('path')

const baseConfig = require('@financial-app/tailwind-config')

const uiDir = path.dirname(
  require.resolve('@financial-app/ui/package.json')
)
const featuresDir = path.resolve(__dirname, '../../packages/features')

/** All palette color keys used dynamically via `bg-${color}` in category icons */
const PALETTE_COLORS = [
  'green', 'yellow', 'cyan', 'navy', 'red', 'purple', 'pink',
  'turquoise', 'brown', 'magenta', 'blue', 'navy-grey', 'army-green',
  'gold', 'orange',
]

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  safelist: PALETTE_COLORS.flatMap((c) => [`bg-${c}`, `border-${c}`]),
  content: [
    path.join(uiDir, 'src/components/**/*.{web.tsx,variants.ts,styles.ts,constants.ts}'),
    path.join(uiDir, 'src/lib/**/*.ts'),
    path.join(featuresDir, 'src/**/*.{web.tsx,styles.ts}'),
    './src/**/*.{ts,tsx}',
    './.storybook/**/*.{ts,tsx}',
  ],
}
