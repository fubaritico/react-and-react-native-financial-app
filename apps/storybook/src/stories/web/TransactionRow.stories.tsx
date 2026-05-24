import { TransactionRow } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Web/Design System/Molecules/TransactionRow',
  component: TransactionRow,
  argTypes: {
    categoryIcon: { control: 'text' },
    categoryColor: { control: 'text' },
    name: { control: 'text' },
    amount: { control: 'number' },
    date: { control: 'text' },
  },
  args: {
    categoryIcon: 'categoryGeneral',
    categoryColor: 'green',
    name: 'Emma Richardson',
    amount: 75.5,
    date: '19 Aug 2024',
  },
} satisfies Meta<typeof TransactionRow>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** Multiple transactions as seen on the Overview page. */
export const Showcase: Story = {
  render: () => (
    <div style={{ maxWidth: 500 }}>
      <TransactionRow
        categoryIcon="categoryGeneral"
        categoryColor="green"
        name="Emma Richardson"
        amount={75.5}
        date="19 Aug 2024"
      />
      <TransactionRow
        categoryIcon="categoryDiningOut"
        categoryColor="red"
        name="Savory Bites Bistro"
        amount={-55.5}
        date="19 Aug 2024"
      />
      <TransactionRow
        categoryIcon="categoryGeneral"
        categoryColor="blue"
        name="Daniel Carter"
        amount={-42.3}
        date="18 Aug 2024"
      />
      <TransactionRow
        categoryIcon="categoryGeneral"
        categoryColor="yellow"
        name="Sun Park"
        amount={120.0}
        date="17 Aug 2024"
      />
      <TransactionRow
        categoryIcon="categoryBills"
        categoryColor="cyan"
        name="Urban Services Hub"
        amount={-65.0}
        date="17 Aug 2024"
      />
    </div>
  ),
}
