import { TransactionsDataTable } from '@financial-app/features/native'
import { mockTransactions } from '@financial-app/shared/mocks'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Native/Design System/Organisms/TransactionsDataTable',
  component: TransactionsDataTable,
  parameters: {
    layout: 'padded',
    backgrounds: 'beige',
  },
} satisfies Meta<typeof TransactionsDataTable>

export default meta
type Story = StoryObj<typeof meta>

/** Default — all 49 mock transactions, sorted by latest. */
export const Default: Story = {
  args: {
    data: mockTransactions,
  },
}

/** Large dataset — repeated transactions to test pagination with many pages. */
export const LargeData: Story = {
  args: {
    data: [
      ...mockTransactions,
      ...mockTransactions,
      ...mockTransactions,
      ...mockTransactions,
    ],
  },
}

/** No data — empty state. */
export const NoData: Story = {
  args: {
    data: [],
  },
}

/** Loading — skeleton rows. */
export const Loading: Story = {
  args: {
    data: [],
    loading: true,
  },
}
