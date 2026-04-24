import { RecurringBillsOverview } from '@financial-app/ui'
import i18n from 'i18next'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Web/Design System/Organisms/RecurringBillsOverview',
  component: RecurringBillsOverview,
} satisfies Meta<typeof RecurringBillsOverview>

export default meta
type Story = StoryObj<typeof meta>

/** Recurring Bills section as seen on the Overview page. */
export const Showcase: Story = {
  args: {
    title: i18n.t('recurringBillsOverview.title'),
    seeDetailsLabel: i18n.t('common.seeDetails'),
    paidBillsLabel: i18n.t('recurringBillsOverview.paidBills'),
    totalUpcomingLabel: i18n.t('recurringBillsOverview.totalUpcoming'),
    dueSoonLabel: i18n.t('recurringBillsOverview.dueSoon'),
    paid: '$190.00',
    upcoming: '$194.98',
    dueSoon: '$59.98',
    onSeeDetails: () => undefined,
  },
  render: (args) => (
    <div style={{ maxWidth: 400 }}>
      <RecurringBillsOverview {...args} />
    </div>
  ),
}
