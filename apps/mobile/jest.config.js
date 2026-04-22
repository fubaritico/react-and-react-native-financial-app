const path = require('path')

const sharedPkg = path.resolve(__dirname, '../../packages/shared/src')

module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.setup.js'],
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  transformIgnorePatterns: [
    'node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|@react-navigation|react-native-screens|react-native-safe-area-context|@financial-app|twrnc|class-variance-authority|clsx)/)',
  ],
  moduleNameMapper: {
    '^@financial-app/shared/mocks$': `${sharedPkg}/mocks/index.ts`,
    '^@financial-app/shared/utils$': `${sharedPkg}/utils/index.ts`,
  },
}
