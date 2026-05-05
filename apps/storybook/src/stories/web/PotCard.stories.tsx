import { PotCard } from '@financial-app/features'
import i18n from 'i18next'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const noop = () => undefined

const meta = {
  title: 'Web/Features/Pots/PotCard',
  component: PotCard,
  args: {
    name: 'Savings',
    total: 159,
    target: 2000,
    color: 'green',
    totalSavedLabel: i18n.t('pots.totalSaved'),
    targetOfLabel: i18n.t('pots.targetOf'),
    addMoneyLabel: i18n.t('pots.addMoney'),
    withdrawLabel: i18n.t('pots.withdraw'),
    editLabel: i18n.t('pots.editPot'),
    deleteLabel: i18n.t('pots.deletePot'),
    onAddMoney: noop,
    onWithdraw: noop,
    onEdit: noop,
    onDelete: noop,
  },
  argTypes: {
    name: { control: 'text' },
    total: { control: 'number' },
    target: { control: 'number' },
    color: { control: 'text' },
  },
} satisfies Meta<typeof PotCard>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {
  render: (args) => (
    <div style={{ width: 600 }}>
      <PotCard {...args} />
    </div>
  ),
}

/** Savings — $159 of $2,000, green theme (7.95%). */
export const Savings: Story = {
  render: (args) => (
    <div style={{ width: 600 }}>
      <PotCard {...args} />
    </div>
  ),
}

/** Concert Ticket — $110 of $150, grey theme (73.3%). */
export const ConcertTicket: Story = {
  args: {
    name: 'Concert Ticket',
    total: 110,
    target: 150,
    color: 'navy',
  },
  render: (args) => (
    <div style={{ width: 600 }}>
      <PotCard {...args} />
    </div>
  ),
}

/** Gift — $40 of $60, cyan theme (66.6%). */
export const Gift: Story = {
  args: {
    name: 'Gift',
    total: 40,
    target: 60,
    color: 'cyan',
  },
  render: (args) => (
    <div style={{ width: 600 }}>
      <PotCard {...args} />
    </div>
  ),
}

/** New Laptop — $10 of $1,000, gold theme (1.0%). */
export const NewLaptop: Story = {
  args: {
    name: 'New Laptop',
    total: 10,
    target: 1000,
    color: 'gold',
  },
  render: (args) => (
    <div style={{ width: 600 }}>
      <PotCard {...args} />
    </div>
  ),
}

/** Holiday — $531 of $1,440, purple theme (36.8%). */
export const Holiday: Story = {
  args: {
    name: 'Holiday',
    total: 531,
    target: 1440,
    color: 'purple',
  },
  render: (args) => (
    <div style={{ width: 600 }}>
      <PotCard {...args} />
    </div>
  ),
}
