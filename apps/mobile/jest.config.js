const path = require('path')

const sharedPkg = path.resolve(__dirname, '../../packages/shared/src')

// Resolve the single react-native copy used by this app.
// pnpm may install multiple copies (different @babel/core peer contexts),
// causing Jest preset mocks to apply to one copy while workspace packages
// import from the other. This forces all imports to the app's copy.
const rnRoot = path.dirname(require.resolve('react-native/package.json'))

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
    '^@financial-app/http-client$': '<rootDir>/jest.mocks/http-client.js',
    '^react-native-svg$': '<rootDir>/jest.mocks/react-native-svg.js',
    '^twrnc$': '<rootDir>/jest.mocks/twrnc.js',
    '^react-native$': rnRoot,
    '^react-native/(.*)$': `${rnRoot}/$1`,
  },
}
