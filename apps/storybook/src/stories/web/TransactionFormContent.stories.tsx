import { TransactionFormContent } from '@financial-app/features'
import { Card } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Web/Features/Transactions/TransactionFormContent',
  component: TransactionFormContent,
  parameters: { layout: 'centered' },
  args: {
    nameLabel: 'Transaction Name',
    namePlaceholder: 'e.g. Urban Sports Club',
    amountLabel: 'Amount',
    amountPlaceholder: 'e.g. 45.00',
    categoryLabel: 'Category',
    recurringLabel: 'Recurring transaction',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 450 }}>
        <Card>
          <Story />
        </Card>
      </div>
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
      amount: -45,
      category: 'Lifestyle',
      recurring: true,
    },
  },
}
