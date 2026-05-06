// Mock @financial-app/shared barrel to avoid pulling in auth/supabase chain.
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@financial-app/shared', () => ({
  ...jest.requireActual('@financial-app/shared/mocks'),
  ...jest.requireActual('@financial-app/shared/utils'),
}))

// Mock @financial-app/ui to avoid twrnc native bridge calls.
jest.mock('@financial-app/ui', () => ({
  Alert: () => null,
  BalanceCard: () => null,
  Spinner: () => null,
  Typography: () => null,
}))

// Mock @financial-app/features to avoid twrnc native bridge calls.
jest.mock('@financial-app/features', () => ({
  BudgetOverview: () => null,
  PotsOverview: () => null,
  TransactionsOverview: () => null,
  RecurringBillsOverview: () => null,
}))

import { renderWithProviders } from '../test-utils'

import { OverviewScreen } from './OverviewScreen'

describe('OverviewScreen', () => {
  it('renders without crashing', () => {
    expect(() => renderWithProviders(<OverviewScreen />)).not.toThrow()
  })
})
