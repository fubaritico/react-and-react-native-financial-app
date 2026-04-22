import { RecurringBillsOverview } from '@financial-app/ui/native'
import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

const meta = {
  title: 'Native/Design System/RecurringBillsOverview',
  component: RecurringBillsOverview,
  argTypes: {
    paid: { control: 'text' },
    upcoming: { control: 'text' },
    dueSoon: { control: 'text' },
    onSeeDetails: { action: 'onSeeDetails' },
  },
  args: {
    paid: '$190.00',
    upcoming: '$194.98',
    dueSoon: '$59.98',
    onSeeDetails: () => undefined,
  },
} satisfies Meta<typeof RecurringBillsOverview>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** Recurring Bills section as seen on the Overview page. */
export const Showcase: Story = {
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
