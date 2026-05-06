import { Spinner } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Web/Design System/Atoms/Spinner',
  component: Spinner,
  argTypes: {
    size: { control: 'number' },
    color: { control: 'color' },
  },
  args: {
    size: 40,
  },
  parameters: {
    backgrounds: 'white',
  },
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** Multiple sizes. */
export const Sizes: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
      }}
    >
      <Spinner size={24} />
      <Spinner size={40} />
      <Spinner size={64} />
    </div>
  ),
}
