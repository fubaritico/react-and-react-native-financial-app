import { renderWithProviders } from '../test-utils'

import { TransactionsScreen } from './TransactionsScreen'

describe('TransactionsScreen', () => {
  it('renders without crashing', () => {
    expect(() => renderWithProviders(<TransactionsScreen />)).not.toThrow()
  })
})
