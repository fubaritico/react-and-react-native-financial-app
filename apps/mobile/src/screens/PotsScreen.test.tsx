import { renderWithProviders } from '../test-utils'

import { PotsScreen } from './PotsScreen'

describe('PotsScreen', () => {
  it('renders without crashing', () => {
    expect(() => renderWithProviders(<PotsScreen />)).not.toThrow()
  })
})
