import { Divider, Typography } from '@financial-app/ui/native'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Native/Design System/Atoms/Divider',
  component: Divider,
  parameters: {
    backgrounds: 'white',
  },
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

/** Interactive playground — divider between two content blocks. */
export const Playground: Story = {
  decorators: [
    (Story: React.ComponentType) => (
      <View
        style={{
          width: 400,
          padding: 24,
          backgroundColor: '#fff',
          borderRadius: 12,
        }}
      >
        <Typography variant="body">First item</Typography>
        <Story />
        <Typography variant="body">Second item</Typography>
      </View>
    ),
  ],
}

/** All spacing variants inside a card-like container. */
export const Showcase: Story = {
  render: () => (
    <View
      style={{
        width: 400,
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
      }}
    >
      <Typography variant="subsection-title">Spacing variants</Typography>
      <Divider spacing="lg" />

      <Typography variant="body-bold">sm</Typography>
      <Typography variant="caption" color="muted">
        4px vertical margin
      </Typography>
      <Divider spacing="sm" />

      <Typography variant="body-bold">md (default)</Typography>
      <Typography variant="caption" color="muted">
        8px vertical margin
      </Typography>
      <Divider spacing="md" />

      <Typography variant="body-bold">lg</Typography>
      <Typography variant="caption" color="muted">
        16px vertical margin
      </Typography>
    </View>
  ),
}
