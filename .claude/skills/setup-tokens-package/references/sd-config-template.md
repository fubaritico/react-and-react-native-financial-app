# sd.config.js Template

Adapted from vite-mf-monorepo reference. Key changes:
- Source path: `src/**/*.json` (not `tokens/`)
- Build path: `build/` (not `dist/`)
- Added `native` platform with custom `size/native` transform
- Tailwind output is a JS map (for Tailwind v3), not CSS `@theme` (Tailwind v4)

```js
import StyleDictionary from 'style-dictionary'

/**
 * Custom format: CSS custom properties (flat, :root)
 */
StyleDictionary.registerFormat({
  name: 'css/variables-flat',
  format: ({ dictionary, options }) => {
    const selector = options.selector || ':root'
    const lines = [`${selector} {`]

    dictionary.allTokens.forEach((token) => {
      const name = token.path.join('-')
      const value = token.$value ?? token.value
      lines.push(`  --${name}: ${value};`)
    })

    lines.push('}')
    lines.push('')
    return lines.join('\n')
  },
})

/**
 * Custom format: TypeScript nested object with `as const`
 */
StyleDictionary.registerFormat({
  name: 'typescript/tokens',
  format: ({ dictionary }) => {
    const tokens = {}

    dictionary.allTokens.forEach((token) => {
      let current = tokens
      const path = token.path

      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {}
        }
        current = current[path[i]]
      }

      current[path[path.length - 1]] = token.$value ?? token.value
    })

    return `export const tokens = ${JSON.stringify(tokens, null, 2)} as const

export type Tokens = typeof tokens
`
  },
})

/**
 * Custom format: Tailwind v3 JS map — flat key-value for theme.extend
 *
 * Output shape: module.exports = { color: { primary: '#hex', ... }, spacing: { ... } }
 * Grouped by top-level category for easy spreading into tailwind.config.js
 */
StyleDictionary.registerFormat({
  name: 'javascript/tailwind-map',
  format: ({ dictionary }) => {
    const grouped = {}

    dictionary.allTokens.forEach((token) => {
      const category = token.path[0] // 'color', 'spacing', 'radius', etc.
      const name = token.path.slice(1).join('-') // flatten remaining path
      const value = token.$value ?? token.value

      if (!grouped[category]) {
        grouped[category] = {}
      }
      grouped[category][name] = value
    })

    const lines = [
      '/** @type {Record<string, Record<string, string>>} */',
      `module.exports = ${JSON.stringify(grouped, null, 2)}`,
      '',
    ]

    return lines.join('\n')
  },
})

/**
 * Custom transform: strip units for React Native (rem -> px number, px -> number)
 * 1rem = 16px base
 */
StyleDictionary.registerTransform({
  name: 'size/native',
  type: 'value',
  filter: (token) => {
    const type = token.$type ?? token.type
    return type === 'dimension'
  },
  transform: (token) => {
    const value = String(token.$value ?? token.value)

    if (value === '0') return 0

    const remMatch = value.match(/^([\d.]+)rem$/)
    if (remMatch) return parseFloat(remMatch[1]) * 16

    const pxMatch = value.match(/^([\d.]+)px$/)
    if (pxMatch) return parseFloat(pxMatch[1])

    // Return as-is if no unit match (e.g. font weights, line heights)
    return value
  },
})

/**
 * Custom format: RN-friendly flat JS export (unitless numbers)
 */
StyleDictionary.registerFormat({
  name: 'javascript/native',
  format: ({ dictionary }) => {
    const tokens = {}

    dictionary.allTokens.forEach((token) => {
      let current = tokens
      const path = token.path

      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {}
        }
        current = current[path[i]]
      }

      current[path[path.length - 1]] = token.$value ?? token.value
    })

    return `module.exports = ${JSON.stringify(tokens, null, 2)}
`
  },
})

export default {
  source: ['src/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables-flat',
          options: { selector: ':root' },
        },
      ],
    },
    tailwind: {
      transformGroup: 'css',
      buildPath: 'build/tailwind/',
      files: [
        {
          destination: 'tailwind.tokens.js',
          format: 'javascript/tailwind-map',
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/es6',
        },
      ],
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'build/ts/',
      files: [
        {
          destination: 'tokens.ts',
          format: 'typescript/tokens',
        },
      ],
    },
    native: {
      transforms: ['name/camel', 'size/native', 'color/hex'],
      buildPath: 'build/native/',
      files: [
        {
          destination: 'tokens.native.js',
          format: 'javascript/native',
        },
      ],
    },
  },
  usesDtcg: true,
}
```

## Notes

- The `size/native` transform converts `rem` to pixel numbers (1rem = 16px base).
- The native format uses `module.exports` (CJS) because Metro bundler handles CJS well.
- The tailwind map uses `module.exports` because `tailwind.config.js` is typically CJS.
- The `css/variables-flat` format is simpler than Style Dictionary's built-in `css/variables`
  because it flattens the path to `--color-primary` instead of `--color-primary-value`.
- `usesDtcg: true` tells Style Dictionary to read `$value` instead of `value`.
