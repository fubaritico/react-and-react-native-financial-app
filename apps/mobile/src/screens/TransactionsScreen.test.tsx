import { render, screen } from '@testing-library/react-native'

import { TransactionsScreen } from './TransactionsScreen'

describe('TransactionsScreen', () => {
  it('renders the title', () => {
    render(<TransactionsScreen />)
    expect(screen.getByText('Transactions')).toBeTruthy()
  })
})
