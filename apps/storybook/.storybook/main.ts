import { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import tsconfigPaths from 'vite-tsconfig-paths'

import type { StorybookConfig } from '@storybook/react-native-web-vite'
import type { Plugin } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(__dirname, '../../..')
const uiPkgDir = path.join(workspaceRoot, 'packages/ui')
const featuresPkgDir = path.join(workspaceRoot, 'packages/features')

/**
 * Custom Vite plugin — transforms .svg file imports into React components.
 * Runs with enforce: 'pre' to beat the framework's asset handler which
 * would otherwise convert SVGs to data-URI strings.
 */
function svgComponentPlugin(): Plugin {
  return {
    name: 'svg-react-component',
    enforce: 'pre',
    load(id) {
      // Handle both bare .svg and .svg?react imports
      const cleanId = id.replace(/\?.*$/, '')
      if (!cleanId.endsWith('.svg')) return null

      const svg = readFileSync(cleanId, 'utf-8')
      return `
import { createElement, forwardRef } from 'react';
const SvgComponent = forwardRef(function SvgComponent(props, ref) {
  return createElement('span', {
    ref,
    ...props,
    style: { display: 'inline-flex', ...props.style },
    dangerouslySetInnerHTML: { __html: ${JSON.stringify(svg)} }
  });
});
export default SvgComponent;
`
    },
  }
}

const config: StorybookConfig = {
  framework: '@storybook/react-native-web-vite',
  stories: ['../src/**/*.stories.@(ts|tsx)'],

  // Disable react-docgen — it chokes on react-native's Flow index.js
  typescript: {
    reactDocgen: false,
  },

  viteFinal: (config) => {
    // Preserve framework aliases (react-native → react-native-web, etc.)
    // The framework may use object form { key: value } or array form [{ find, replacement }]
    const rawAlias = config.resolve?.alias
    const existingAlias: { find: string | RegExp; replacement: string }[] =
      Array.isArray(rawAlias)
        ? rawAlias
        : rawAlias && typeof rawAlias === 'object'
          ? Object.entries(rawAlias).map(([find, replacement]) => ({
              find,
              replacement: replacement as string,
            }))
          : []

    config.resolve = {
      ...config.resolve,
      alias: [
        ...existingAlias,
        // Regex ensures exact match — no prefix matching
        {
          find: /^@financial-app\/ui\/web$/,
          replacement: path.join(uiPkgDir, 'src/index.web.ts'),
        },
        {
          find: /^@financial-app\/ui\/native$/,
          replacement: path.join(uiPkgDir, 'src/index.ts'),
        },
        {
          find: /^@financial-app\/ui$/,
          replacement: path.join(uiPkgDir, 'src/index.web.ts'),
        },
        // @financial-app/features aliases
        {
          find: /^@financial-app\/features\/overview\/web$/,
          replacement: path.join(featuresPkgDir, 'src/overview/index.web.ts'),
        },
        {
          find: /^@financial-app\/features\/overview\/native$/,
          replacement: path.join(featuresPkgDir, 'src/overview/index.ts'),
        },
        {
          find: /^@financial-app\/features\/overview$/,
          replacement: path.join(featuresPkgDir, 'src/overview/index.web.ts'),
        },
        {
          find: /^@financial-app\/features\/transactions\/web$/,
          replacement: path.join(
            featuresPkgDir,
            'src/transactions/index.web.ts'
          ),
        },
        {
          find: /^@financial-app\/features\/transactions\/native$/,
          replacement: path.join(featuresPkgDir, 'src/transactions/index.ts'),
        },
        {
          find: /^@financial-app\/features\/transactions$/,
          replacement: path.join(
            featuresPkgDir,
            'src/transactions/index.web.ts'
          ),
        },
        {
          find: /^@financial-app\/features\/native$/,
          replacement: path.join(featuresPkgDir, 'src/index.ts'),
        },
        {
          find: /^@financial-app\/features$/,
          replacement: path.join(featuresPkgDir, 'src/index.web.ts'),
        },
      ],
    }

    // svgComponentPlugin with enforce:'pre' MUST come first — beats the
    // framework's asset handler that converts SVGs to data-URI strings.
    config.plugins = [
      svgComponentPlugin(),
      ...(config.plugins ?? []),
      tsconfigPaths({
        projects: [
          path.join(uiPkgDir, 'tsconfig.json'),
          path.join(featuresPkgDir, 'tsconfig.json'),
        ],
      }),
    ]

    config.server = {
      ...config.server,
      fs: {
        ...config.server?.fs,
        allow: [workspaceRoot],
      },
    }

    return config
  },
}

export default config
