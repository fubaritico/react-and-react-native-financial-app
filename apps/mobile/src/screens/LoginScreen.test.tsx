// Mock @financial-app/shared barrel to avoid pulling in auth/supabase chain.
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@financial-app/shared', () => ({
  ...jest.requireActual('@financial-app/shared/mocks'),
  ...jest.requireActual('@financial-app/shared/utils'),
  loginSchema: {
    safeParse: () => ({ success: false, error: { issues: [] } }),
  },
  parseValidationErrors: () => ({}),
}))

// Mock supabase client to avoid AsyncStorage import.
jest.mock('../lib/supabase', () => ({
  authClient: { signInWithPassword: jest.fn() },
}))

// Mock @financial-app/ui to avoid twrnc native bridge calls.
jest.mock('@financial-app/ui/native', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const RN = require('react-native')
  return {
    Alert: () => <RN.View />,
    AuthCard: ({ children }: { children: React.ReactNode }) => (
      <RN.View>{children}</RN.View>
    ),
    AuthLayout: ({ children }: { children: React.ReactNode }) => (
      <RN.View>{children}</RN.View>
    ),
    Button: ({ title }: { title: string }) => <RN.Text>{title}</RN.Text>,
    LinkText: () => <RN.View />,
    PasswordInput: () => <RN.View />,
    TextInput: () => <RN.View />,
  }
})

import { render } from '@testing-library/react-native'

import { LoginScreen } from './LoginScreen'

describe('LoginScreen', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<LoginScreen />)
    expect(toJSON()).toBeTruthy()
  })
})
