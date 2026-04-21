import type { StorybookConfig } from '@storybook/react-native-web-vite'

const config: StorybookConfig = {
  framework: '@storybook/react-native-web-vite',
  stories: ['../src/**/*.stories.@(ts|tsx)'],

  // Prioritize .web.tsx so stories render web implementations by default.
  // The framework already aliases react-native -> react-native-web,
  // so .native.tsx files could also be rendered if explicitly imported.
  viteFinal: async (config) => {
    config.resolve = {
      ...config.resolve,
      extensions: [
        '.web.tsx',
        '.web.ts',
        '.web.jsx',
        '.web.js',
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
      ],
    }
    return config
  },
}

export default config
