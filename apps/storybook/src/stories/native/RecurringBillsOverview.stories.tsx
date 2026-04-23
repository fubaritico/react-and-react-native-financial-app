import { RecurringBillsOverview } from '@financial-app/ui/native'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Native/Design System/Organisms/RecurringBillsOverview',
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
    <View style={{ maxWidth: 400 }}>
      <RecurringBillsOverview
        paid="$190.00"
        upcoming="$194.98"
        dueSoon="$59.98"
        onSeeDetails={() => undefined}
      />
    </View>
  ),
}
