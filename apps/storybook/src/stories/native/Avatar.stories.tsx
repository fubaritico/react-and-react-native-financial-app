import { Avatar } from '@financial-app/ui/native'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Native/Design System/Avatar',
  component: Avatar,
  argTypes: {
    src: { control: 'text' },
    name: { control: 'text' },
    size: { control: 'number' },
  },
  args: {
    src: 'https://i.pravatar.cc/80?u=emma',
    name: 'Emma Richardson',
    size: 40,
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** Different sizes. */
export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
      <Avatar src="https://i.pravatar.cc/80?u=a" name="Small User" size={24} />
      <Avatar
        src="https://i.pravatar.cc/80?u=b"
        name="Default User"
        size={40}
      />
      <Avatar src="https://i.pravatar.cc/80?u=c" name="Large User" size={56} />
    </View>
  ),
}

/** Fallback to initials when image fails to load. */
export const Fallback: Story = {
  args: {
    src: 'https://broken-url.invalid/avatar.jpg',
    name: 'Daniel Carter',
  },
}
