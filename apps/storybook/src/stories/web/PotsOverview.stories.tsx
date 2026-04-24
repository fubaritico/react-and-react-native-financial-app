import { PotsOverview } from '@financial-app/ui'
import i18n from 'i18next'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const noop = () => undefined

const defaultPots = [
  { name: 'Savings', total: '$159', color: 'green' },
  { name: 'Gift', total: '$40', color: 'navy' },
  { name: 'Concert Ticket', total: '$110', color: 'cyan' },
  { name: 'New Laptop', total: '$10', color: 'yellow' },
]

const meta = {
  title: 'Web/Design System/Organisms/PotsOverview',
  component: PotsOverview,
} satisfies Meta<typeof PotsOverview>

export default meta
type Story = StoryObj<typeof meta>

/** Realistic Overview page data with 4 pots. */
export const Showcase: Story = {
  args: {
    title: i18n.t('potsOverview.title'),
    seeDetailsLabel: i18n.t('common.seeDetails'),
    totalSavedLabel: i18n.t('potsOverview.totalSaved'),
    savingsIconLabel: i18n.t('accessibility.savingsIcon'),
    totalSaved: '$850',
    pots: defaultPots,
    onSeeDetails: noop,
  },
  render: (args) => (
    <div style={{ maxWidth: 560, padding: 24 }}>
      <PotsOverview {...args} />
    </div>
  ),
}
