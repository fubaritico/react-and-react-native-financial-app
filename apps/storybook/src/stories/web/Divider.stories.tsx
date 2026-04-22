import { Divider } from '@financial-app/ui'
import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Web/Design System/Divider',
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
      <div style={{ width: 400, padding: 16 }}>
        <p>Content above</p>
        <Story />
        <p>Content below</p>
      </div>
    ),
  ],
}

/** All spacing variants. */
export const Showcase: Story = {
  render: () => (
    <div style={{ width: 400, padding: 16 }}>
      <p>Small spacing</p>
      <Divider spacing="sm" />
      <p>Medium spacing (default)</p>
      <Divider spacing="md" />
      <p>Large spacing</p>
      <Divider spacing="lg" />
      <p>End</p>
    </div>
  ),
}
