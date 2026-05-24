const baseConfig = require('@financial-app/tailwind-config')
const containerQueries = require('@tailwindcss/container-queries')

/** All palette color keys used dynamically via `bg-${color}` in category icons */
const PALETTE_COLORS = [
  'green', 'yellow', 'cyan', 'navy', 'red', 'purple', 'pink',
  'turquoise', 'brown', 'magenta', 'blue', 'navy-grey', 'army-green',
  'gold', 'orange',
]

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  plugins: [...(baseConfig.plugins || []), containerQueries],
  safelist: PALETTE_COLORS.flatMap((c) => [`bg-${c}`, `border-${c}`]),
  content: [
    './app/**/*.{ts,tsx}',
    '../../packages/ui/src/components/**/*.{web.tsx,variants.ts,styles.ts,constants.ts}',
    '../../packages/ui/src/lib/**/*.ts',
    '../../packages/features/src/**/*.{web.tsx,styles.ts}',
  ],
}
