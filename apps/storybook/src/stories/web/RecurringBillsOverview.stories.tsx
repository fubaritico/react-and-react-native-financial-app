import { RecurringBillsOverview } from '@financial-app/ui'

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
    paid: '$190.00',
    upcoming: '$194.98',
    dueSoon: '$59.98',
    onSeeDetails: () => undefined,
  },
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <RecurringBillsOverview
        paid="$190.00"
        upcoming="$194.98"
        dueSoon="$59.98"
        onSeeDetails={() => undefined}
      />
    </div>
  ),
}
