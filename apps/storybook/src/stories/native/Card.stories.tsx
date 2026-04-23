import { Card } from '@financial-app/ui/native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Native/Design System/Organisms/Card',
  component: Card,
  argTypes: {
    title: { control: 'text' },
    text: { control: 'text' },
  },
  args: {
    title: 'Card Title',
    text: 'Card content goes here.',
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}
