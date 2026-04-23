import { BalanceCard } from '@financial-app/ui/native'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Native/Design System/Molecules/BalanceCard',
  component: BalanceCard,
  argTypes: {
    tone: { control: 'select', options: ['dark', 'light'] },
    label: { control: 'text' },
    amount: { control: 'text' },
  },
  args: {
    label: 'Current Balance',
    amount: '$4,836.00',
    tone: 'dark',
  },
} satisfies Meta<typeof BalanceCard>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** All 3 balance cards as seen on the Overview page. */
export const Showcase: Story = {
  render: () => (
    <View style={{ gap: 16, maxWidth: 800 }}>
      <BalanceCard label="Current Balance" amount="$4,836.00" tone="dark" />
      <BalanceCard label="Income" amount="$3,814.25" tone="light" />
      <BalanceCard label="Expenses" amount="$1,700.50" tone="light" />
    </View>
  ),
}
