import rootConfig from '../../eslint.config.js'
import tseslint from 'typescript-eslint'
import reactNative from 'eslint-plugin-react-native'

export default tseslint.config(
  ...rootConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-native': reactNative,
    },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'react-native/no-raw-text': 'error',
      'react-native/no-inline-styles': 'warn',
    },
  },
  {
    files: ['**/*.web.{ts,tsx}'],
    rules: {
      'react-native/no-raw-text': 'off',
      'react-native/no-inline-styles': 'off',
    },
  }
)
