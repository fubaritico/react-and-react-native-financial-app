import { render, screen } from '@testing-library/react-native'

import { SignupScreen } from './SignupScreen'

describe('SignupScreen', () => {
  it('renders the title', () => {
    render(<SignupScreen />)
    expect(screen.getByText('Sign Up')).toBeTruthy()
  })
})
