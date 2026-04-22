import { render, screen } from '@testing-library/react-native'

import { RecurringScreen } from './RecurringScreen'

describe('RecurringScreen', () => {
  it('renders the title', () => {
    render(<RecurringScreen />)
    expect(screen.getByText('Recurring Bills')).toBeTruthy()
  })
})
