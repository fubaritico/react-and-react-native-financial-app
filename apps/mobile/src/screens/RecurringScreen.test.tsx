import { renderWithProviders } from '../test-utils'

import { RecurringScreen } from './RecurringScreen'

describe('RecurringScreen', () => {
  it('renders without crashing', () => {
    expect(() => renderWithProviders(<RecurringScreen />)).not.toThrow()
  })
})
