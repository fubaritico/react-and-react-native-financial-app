import { TransactionFormContent } from '@financial-app/features/native'
import { Card } from '@financial-app/ui'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Native/Features/Transactions/TransactionFormContent',
  component: TransactionFormContent,
  parameters: { layout: 'centered' },
  args: {
    nameLabel: 'Transaction Name',
    namePlaceholder: 'e.g. Urban Sports Club',
    amountLabel: 'Amount',
    amountPlaceholder: 'e.g. 45.00',
    categoryLabel: 'Category',
    dateLabel: 'Date',
    datePlaceholder: 'Select date',
    recurringLabel: 'Recurring transaction',
    categories: [
      { label: 'General', value: 'cat-001' },
      { label: 'Dining Out', value: 'cat-002' },
      { label: 'Entertainment', value: 'cat-003' },
      { label: 'Bills', value: 'cat-004' },
      { label: 'Transportation', value: 'cat-005' },
    ],
  },
  decorators: [
    (Story) => (
      <View style={{ width: 450 }}>
        <Card>
          <Story />
        </Card>
      </View>
    ),
  ],
} satisfies Meta<typeof TransactionFormContent>

export default meta
type Story = StoryObj<typeof meta>

/** Default empty form — add transaction mode. */
export const Default: Story = {}

/** With description text above the fields. */
export const WithDescription: Story = {
  args: {
    description: 'Create a new manual transaction entry.',
  },
}

/** Pre-filled form — edit transaction mode. */
export const EditMode: Story = {
  args: {
    description: 'Update the details of this transaction.',
    initialValues: {
      name: 'Urban Sports Club',
      amount: '-45',
      category_id: 'cat-003',
      date: '2026-04-15',
      recurring: true,
    },
  },
}
