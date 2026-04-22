import { StatCard } from '@financial-app/ui'
import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Web/Design System/StatCard',
  component: StatCard,
  argTypes: {
    label: { control: 'text' },
    amount: { control: 'text' },
    color: {
      control: 'select',
      options: [
        'green',
        'cyan',
        'navy',
        'yellow',
        'purple',
        'turquoise',
        'brown',
      ],
    },
  },
  args: {
    label: 'Savings',
    amount: '$159',
    color: 'green',
  },
} satisfies Meta<typeof StatCard>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** Pots overview as seen on the Overview page. */
export const Showcase: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        maxWidth: 400,
      }}
    >
      <StatCard label="Savings" amount="$159" color="green" />
      <StatCard label="Gift" amount="$40" color="cyan" />
      <StatCard label="Concert Ticket" amount="$110" color="navy" />
      <StatCard label="New Laptop" amount="$10" color="yellow" />
    </div>
  ),
}
