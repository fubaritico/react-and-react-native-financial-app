import { SignupForm } from '@financial-app/features'

import type { IAuthClient } from '@financial-app/shared'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const mockAuthClient = {
  signUp: () =>
    Promise.resolve({ user: null, error: null, isExistingEmail: false }),
  getUser: () => Promise.resolve({ user: null, error: null }),
  getClaims: () => Promise.resolve({ claims: null, error: null }),
  getSession: () => Promise.resolve({ session: null, error: null }),
  signInWithPassword: () => Promise.resolve({ user: null, error: null }),
  signInWithOAuth: () => Promise.resolve({ url: null, error: null }),
  signInWithIdToken: () => Promise.resolve({ user: null, error: null }),
  refreshSession: () => Promise.resolve({ session: null, error: null }),
  signOut: () => Promise.resolve({ error: null }),
  onAuthStateChange: () => ({ unsubscribe: noop }),
  getAssuranceLevel: () =>
    Promise.resolve({
      currentLevel: 'aal1' as const,
      hasMfaEnrolled: false,
      error: null,
    }),
  mfa: {
    enroll: () => Promise.resolve({ factor: null, error: null }),
    challenge: () => Promise.resolve({ challenge: null, error: null }),
    verify: () => Promise.resolve({ error: null }),
    listFactors: () => Promise.resolve({ factors: [], error: null }),
    unenroll: () => Promise.resolve({ error: null }),
  },
} satisfies IAuthClient

const meta = {
  title: 'Web/Features/Auth/SignupForm',
  component: SignupForm,
  parameters: { layout: 'fullscreen' },
  args: {
    authClient: mockAuthClient,
    onSignupSuccess: noop,
    onNavigateToLogin: noop,
  },
} satisfies Meta<typeof SignupForm>

export default meta
type Story = StoryObj<typeof meta>

/** Default signup form with empty fields. */
export const Default: Story = {}

/** Signup form showing existing email error after submit. */
export const ExistingEmail: Story = {
  args: {
    authClient: {
      ...mockAuthClient,
      signUp: () =>
        Promise.resolve({ user: null, error: null, isExistingEmail: true }),
    },
  },
}

/** Signup form showing server error after submit. */
export const ServerError: Story = {
  args: {
    authClient: {
      ...mockAuthClient,
      signUp: () =>
        Promise.resolve({
          user: null,
          error: { message: 'An unexpected error occurred' },
          isExistingEmail: false,
        }),
    },
  },
}
