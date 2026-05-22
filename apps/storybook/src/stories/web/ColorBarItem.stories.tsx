import { ColorBarItem } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Web/Design System/Molecules/ColorBarItem',
  component: ColorBarItem,
} satisfies Meta<typeof ColorBarItem>

export default meta
type Story = StoryObj<typeof meta>

/** Simple item — label + amount (e.g. Pots grid). */
export const Simple: Story = {
  args: {
    label: 'Savings',
    amount: 159,
    color: 'green',
  },
  render: (args) => (
    <div style={{ maxWidth: 300 }}>
      <ColorBarItem {...args} />
    </div>
  ),
}

/** With secondary amount — "spent of max" layout (e.g. Budget spending summary). */
export const WithSecondary: Story = {
  args: {
    label: 'Bills',
    amount: 150,
    color: 'cyan',
    secondaryAmount: 750,
    secondaryLabel: 'of',
  },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <ColorBarItem {...args} />
    </div>
  ),
}

/** Different colors — visual check for token color resolution. */
export const Colors: Story = {
  args: { label: 'Entertainment', amount: 50, color: 'green' },
  render: () => (
    <div
      style={{
        maxWidth: 300,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <ColorBarItem label="Entertainment" amount={50} color="green" />
      <ColorBarItem label="Bills" amount={750} color="cyan" />
      <ColorBarItem label="Dining Out" amount={75} color="yellow" />
      <ColorBarItem label="Personal Care" amount={100} color="navy" />
    </div>
  ),
}

/** Spending summary list — multiple items with secondary amounts. */
export const SpendingList: Story = {
  args: { label: 'Bills', amount: 250, color: 'cyan' },
  render: () => (
    <div style={{ maxWidth: 400, display: 'flex', flexDirection: 'column' }}>
      {[
        { label: 'Bills', amount: 250, color: 'cyan', secondaryAmount: 750 },
        {
          label: 'Dining Out',
          amount: 67,
          color: 'yellow',
          secondaryAmount: 75,
        },
        {
          label: 'Personal Care',
          amount: 65,
          color: 'navy',
          secondaryAmount: 100,
        },
        {
          label: 'Entertainment',
          amount: 25,
          color: 'green',
          secondaryAmount: 50,
        },
      ].map((item) => (
        <div
          key={item.label}
          style={{ borderBottom: '1px solid #e5e5e5', padding: '12px 0' }}
        >
          <ColorBarItem {...item} secondaryLabel="of" />
        </div>
      ))}
    </div>
  ),
}

/** EUR locale — currency formatting via CurrencyContext provider. */
export const EurLocale: Story = {
  args: {
    label: 'Épargne',
    amount: 1234.5,
    color: 'green',
    secondaryAmount: 5000,
    secondaryLabel: 'sur',
  },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <ColorBarItem {...args} />
    </div>
  ),
}
