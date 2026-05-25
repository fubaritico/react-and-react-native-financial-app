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
      {
        id: 'cat-001',
        name: 'General',
        icon: 'categoryGeneral',
        color: 'blue',
        is_system: true,
      },
      {
        id: 'cat-002',
        name: 'Dining Out',
        icon: 'categoryDiningOut',
        color: 'brown',
        is_system: true,
      },
      {
        id: 'cat-003',
        name: 'Entertainment',
        icon: 'categoryEntertainment',
        color: 'red',
        is_system: true,
      },
      {
        id: 'cat-004',
        name: 'Bills',
        icon: 'categoryBills',
        color: 'blue',
        is_system: true,
      },
      {
        id: 'cat-005',
        name: 'Transportation',
        icon: 'categoryTransportation',
        color: 'navy-grey',
        is_system: true,
      },
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
