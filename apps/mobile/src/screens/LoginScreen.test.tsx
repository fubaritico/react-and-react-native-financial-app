import { render, screen } from '@testing-library/react-native'

import { LoginScreen } from './LoginScreen'

describe('LoginScreen', () => {
  it('renders the title', () => {
    render(<LoginScreen />)
    expect(screen.getByText('Login')).toBeTruthy()
  })
})
