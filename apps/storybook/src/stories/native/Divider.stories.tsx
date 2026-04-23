import { Divider } from '@financial-app/ui/native'
import { Text, View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Native/Design System/Atoms/Divider',
  component: Divider,
  argTypes: {
    spacing: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
  args: {
    spacing: 'md',
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {
  decorators: [
    (Story: React.ComponentType) => (
      <View style={{ width: 400, padding: 16 }}>
        <Text>Content above</Text>
        <Story />
        <Text>Content below</Text>
      </View>
    ),
  ],
}

/** All spacing variants. */
export const Showcase: Story = {
  render: () => (
    <View style={{ width: 400, padding: 16 }}>
      <Text>Small spacing</Text>
      <Divider spacing="sm" />
      <Text>Medium spacing (default)</Text>
      <Divider spacing="md" />
      <Text>Large spacing</Text>
      <Divider spacing="lg" />
      <Text>End</Text>
    </View>
  ),
}
