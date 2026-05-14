import { reactNative } from 'vitest-native'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'web',
          environment: 'jsdom',
          include: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
          exclude: ['src/**/*.native.test.tsx', 'src/**/*.native.test.ts'],
          setupFiles: ['./vitest.setup.mts'],
        },
      },
      {
        plugins: [reactNative()],
        test: {
          name: 'native',
          globals: true,
          include: ['src/**/*.native.test.tsx', 'src/**/*.native.test.ts'],
          setupFiles: ['./vitest.native.setup.mts'],
        },
      },
    ],
  },
})
