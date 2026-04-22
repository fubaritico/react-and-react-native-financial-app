import { render, screen } from '@testing-library/react-native'

import { BudgetsScreen } from './BudgetsScreen'

describe('BudgetsScreen', () => {
  it('renders the title', () => {
    render(<BudgetsScreen />)
    expect(screen.getByText('Budgets')).toBeTruthy()
  })
})
