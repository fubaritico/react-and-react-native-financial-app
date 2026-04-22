import { ColorDot } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Web/Design System/ColorDot',
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
    <div
      style={{
        display: 'flex',
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
        <div
          key={c}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <ColorDot color={c} />
          <span style={{ fontSize: 10 }}>{c}</span>
        </div>
      ))}
    </div>
  ),
}
