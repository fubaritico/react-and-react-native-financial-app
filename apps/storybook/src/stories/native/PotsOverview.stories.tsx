import { PotsOverview } from '@financial-app/ui/native'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const noop = () => undefined

const defaultPots = [
  { name: 'Savings', total: '$159', color: 'green' },
  { name: 'Gift', total: '$40', color: 'navy' },
  { name: 'Concert Ticket', total: '$110', color: 'cyan' },
  { name: 'New Laptop', total: '$10', color: 'yellow' },
]

const meta = {
  title: 'Native/Design System/PotsOverview',
  component: PotsOverview,
  argTypes: {
    totalSaved: { control: 'text' },
    onSeeDetails: { action: 'see-details pressed' },
  },
  args: {
    totalSaved: '$850',
    pots: defaultPots,
    onSeeDetails: noop,
  },
} satisfies Meta<typeof PotsOverview>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** Realistic Overview page data with 4 pots. */
export const Showcase: Story = {
  render: () => (
    <View style={{ maxWidth: 560, padding: 24 }}>
      <PotsOverview totalSaved="$850" pots={defaultPots} onSeeDetails={noop} />
    </View>
  ),
}
