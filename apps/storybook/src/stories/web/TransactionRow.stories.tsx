import { TransactionRow } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Web/Design System/TransactionRow',
  component: TransactionRow,
  argTypes: {
    avatar: { control: 'text' },
    name: { control: 'text' },
    amount: { control: 'number' },
    date: { control: 'text' },
    showDivider: { control: 'boolean' },
  },
  args: {
    avatar: 'https://i.pravatar.cc/80?u=emma',
    name: 'Emma Richardson',
    amount: 75.5,
    date: '19 Aug 2024',
    showDivider: true,
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
        avatar="https://i.pravatar.cc/80?u=emma"
        name="Emma Richardson"
        amount={75.5}
        date="19 Aug 2024"
      />
      <TransactionRow
        avatar="https://i.pravatar.cc/80?u=savory"
        name="Savory Bites Bistro"
        amount={-55.5}
        date="19 Aug 2024"
      />
      <TransactionRow
        avatar="https://i.pravatar.cc/80?u=daniel"
        name="Daniel Carter"
        amount={-42.3}
        date="18 Aug 2024"
      />
      <TransactionRow
        avatar="https://i.pravatar.cc/80?u=sun"
        name="Sun Park"
        amount={120.0}
        date="17 Aug 2024"
      />
      <TransactionRow
        avatar="https://i.pravatar.cc/80?u=urban"
        name="Urban Services Hub"
        amount={-65.0}
        date="17 Aug 2024"
        showDivider={false}
      />
    </div>
  ),
}
