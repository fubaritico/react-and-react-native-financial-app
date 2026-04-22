import { render, screen } from '@testing-library/react-native'

import { PotsScreen } from './PotsScreen'

describe('PotsScreen', () => {
  it('renders the title', () => {
    render(<PotsScreen />)
    expect(screen.getByText('Pots')).toBeTruthy()
  })
})
