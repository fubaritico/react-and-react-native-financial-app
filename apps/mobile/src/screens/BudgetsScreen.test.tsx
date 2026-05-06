import { renderWithProviders } from '../test-utils'

import { BudgetsScreen } from './BudgetsScreen'

describe('BudgetsScreen', () => {
  it('renders without crashing', () => {
    expect(() => renderWithProviders(<BudgetsScreen />)).not.toThrow()
  })
})
