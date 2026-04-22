import { ColorDot } from '@financial-app/ui/native'
import { Text, View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Native/Design System/ColorDot',
  component: ColorDot,
  argTypes: {
    color: {
      control: 'select',
      options: [
        'green',
        'yellow',
        'cyan',
        'navy',
        'red',
        'purple',
        'pink',
        'turquoise',
        'brown',
        'magenta',
        'blue',
        'orange',
        'gold',
      ],
    },
    size: { control: 'number' },
  },
  args: {
    color: 'green',
    size: 16,
  },
} satisfies Meta<typeof ColorDot>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** All theme colors. */
export const Showcase: Story = {
  render: () => (
    <View
      style={{
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      {[
        'green',
        'yellow',
        'cyan',
        'navy',
        'red',
        'purple',
        'pink',
        'turquoise',
        'brown',
        'magenta',
        'blue',
        'orange',
        'gold',
      ].map((c) => (
        <View key={c} style={{ alignItems: 'center', gap: 4 }}>
          <ColorDot color={c} />
          <Text style={{ fontSize: 10 }}>{c}</Text>
        </View>
      ))}
    </View>
  ),
}
