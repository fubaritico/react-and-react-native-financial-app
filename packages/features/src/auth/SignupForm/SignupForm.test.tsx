import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { IAuthClient } from '@financial-app/shared'

import { SignupForm } from './SignupForm.web'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

function createMockAuthClient(overrides?: Partial<IAuthClient>): IAuthClient {
  return {
    getUser: vi.fn(),
    getSession: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn().mockResolvedValue({
      user: null,
      error: null,
      isExistingEmail: false,
    }),
    signInWithOAuth: vi.fn(),
    signInWithIdToken: vi.fn(),
    refreshSession: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
    getAssuranceLevel: vi.fn(),
    mfa: {
      enroll: vi.fn(),
      challenge: vi.fn(),
      verify: vi.fn(),
      listFactors: vi.fn(),
      unenroll: vi.fn(),
    },
    ...overrides,
  } as IAuthClient
}

const DEFAULT_PROPS = {
  authClient: createMockAuthClient(),
  onSignupSuccess: vi.fn(),
  onNavigateToLogin: vi.fn(),
}

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

describe('SignupForm', () => {
  it('renders all form fields', () => {
    render(<SignupForm {...DEFAULT_PROPS} />)

    expect(screen.getByLabelText('auth.name')).toBeInTheDocument()
    expect(screen.getByLabelText('auth.email')).toBeInTheDocument()
    expect(screen.getByLabelText('auth.password')).toBeInTheDocument()
    expect(screen.getByLabelText('auth.confirmPassword')).toBeInTheDocument()
  })

  it('renders password rules list', () => {
    render(<SignupForm {...DEFAULT_PROPS} />)

    expect(screen.getByText('auth.passwordRules.minLength')).toBeInTheDocument()
    expect(screen.getByText('auth.passwordRules.uppercase')).toBeInTheDocument()
    expect(screen.getByText('auth.passwordRules.match')).toBeInTheDocument()
  })

  it('renders signup button disabled initially (rules not met)', () => {
    render(<SignupForm {...DEFAULT_PROPS} />)

    const button = screen.getByRole('button', { name: 'auth.signupButton' })
    expect(button).toBeDisabled()
  })

  it('renders login link', () => {
    render(<SignupForm {...DEFAULT_PROPS} />)

    expect(screen.getByText('auth.alreadyHaveAccountLink')).toBeInTheDocument()
  })

  it('calls onNavigateToLogin when login link is pressed', async () => {
    const user = userEvent.setup()
    const onNavigateToLogin = vi.fn()
    render(
      <SignupForm {...DEFAULT_PROPS} onNavigateToLogin={onNavigateToLogin} />
    )

    await user.click(screen.getByText('auth.alreadyHaveAccountLink'))

    expect(onNavigateToLogin).toHaveBeenCalledOnce()
  })

  it('enables submit when all password rules pass', async () => {
    const user = userEvent.setup()
    render(<SignupForm {...DEFAULT_PROPS} />)

    const passwordInput = screen.getByLabelText('auth.password')
    const confirmInput = screen.getByLabelText('auth.confirmPassword')

    await user.type(passwordInput, 'MyStr0ngP@ssword!')
    await user.type(confirmInput, 'MyStr0ngP@ssword!')

    const button = screen.getByRole('button', { name: 'auth.signupButton' })
    expect(button).not.toBeDisabled()
  })

  it('calls authClient.signUp on submit with valid form', async () => {
    const user = userEvent.setup()
    const signUpMock = vi.fn().mockResolvedValue({
      user: null,
      error: null,
      isExistingEmail: false,
    })
    const authClient = createMockAuthClient({ signUp: signUpMock })
    const onSignupSuccess = vi.fn()
    render(
      <SignupForm
        authClient={authClient}
        onSignupSuccess={onSignupSuccess}
        onNavigateToLogin={vi.fn()}
      />
    )

    await user.type(screen.getByLabelText('auth.name'), 'John')
    await user.type(screen.getByLabelText('auth.email'), 'john@test.com')
    await user.type(screen.getByLabelText('auth.password'), 'MyStr0ngP@ssword!')
    await user.type(
      screen.getByLabelText('auth.confirmPassword'),
      'MyStr0ngP@ssword!'
    )

    await user.click(screen.getByRole('button', { name: 'auth.signupButton' }))

    await waitFor(() => {
      expect(signUpMock).toHaveBeenCalledWith({
        name: 'John',
        email: 'john@test.com',
        password: 'MyStr0ngP@ssword!',
      })
    })

    expect(onSignupSuccess).toHaveBeenCalledWith('john@test.com')
  })

  it('shows server error on existing email', async () => {
    const user = userEvent.setup()
    const authClient = createMockAuthClient({
      signUp: vi.fn().mockResolvedValue({
        user: null,
        error: null,
        isExistingEmail: true,
      }),
    })
    render(
      <SignupForm
        authClient={authClient}
        onSignupSuccess={vi.fn()}
        onNavigateToLogin={vi.fn()}
      />
    )

    await user.type(screen.getByLabelText('auth.name'), 'John')
    await user.type(screen.getByLabelText('auth.email'), 'john@test.com')
    await user.type(screen.getByLabelText('auth.password'), 'MyStr0ngP@ssword!')
    await user.type(
      screen.getByLabelText('auth.confirmPassword'),
      'MyStr0ngP@ssword!'
    )
    await user.click(screen.getByRole('button', { name: 'auth.signupButton' }))

    await waitFor(() => {
      expect(
        screen.getByText('auth.emailAlreadyRegistered')
      ).toBeInTheDocument()
    })
  })

  it('shows server error on auth failure', async () => {
    const user = userEvent.setup()
    const authClient = createMockAuthClient({
      signUp: vi.fn().mockResolvedValue({
        user: null,
        error: { message: 'Network error' },
        isExistingEmail: false,
      }),
    })
    render(
      <SignupForm
        authClient={authClient}
        onSignupSuccess={vi.fn()}
        onNavigateToLogin={vi.fn()}
      />
    )

    await user.type(screen.getByLabelText('auth.name'), 'John')
    await user.type(screen.getByLabelText('auth.email'), 'john@test.com')
    await user.type(screen.getByLabelText('auth.password'), 'MyStr0ngP@ssword!')
    await user.type(
      screen.getByLabelText('auth.confirmPassword'),
      'MyStr0ngP@ssword!'
    )
    await user.click(screen.getByRole('button', { name: 'auth.signupButton' }))

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })
})
