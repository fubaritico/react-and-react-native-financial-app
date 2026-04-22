import path from 'path'
import { fileURLToPath } from 'url'

import type { StorybookConfig } from '@storybook/react-native-web-vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const workspaceRoot = path.resolve(__dirname, '../../..')
const uiPkgDir = path.join(workspaceRoot, 'packages/ui')

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
      ],
    }

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
