import { render, screen } from '@testing-library/react-native'

// Mock @financial-app/shared barrel to avoid pulling in auth/supabase chain.
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@financial-app/shared', () => ({
  ...jest.requireActual('@financial-app/shared/mocks'),
  ...jest.requireActual('@financial-app/shared/utils'),
}))

// Mock @financial-app/ui to avoid twrnc native bridge calls.
jest.mock('@financial-app/ui', () => ({
  BalanceCard: () => null,
  PotsOverview: () => null,
  TransactionsOverview: () => null,
  RecurringBillsOverview: () => null,
}))

import { OverviewScreen } from './OverviewScreen'

describe('OverviewScreen', () => {
  it('renders without crashing', () => {
    expect(() => render(<OverviewScreen />)).not.toThrow()
  })

  it('renders the title', () => {
    render(<OverviewScreen />)
    expect(screen.getByText('Overview')).toBeTruthy()
  })

  it('renders budgets placeholder', () => {
    render(<OverviewScreen />)
    expect(screen.getByText('Budgets')).toBeTruthy()
  })
})
