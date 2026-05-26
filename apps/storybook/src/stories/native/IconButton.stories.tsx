import { iconNames } from '@financial-app/icons'
import { IconButton } from '@financial-app/ui/native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Native/Design System/Atoms/IconButton',
  component: IconButton,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'destroy'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    icon: {
      control: 'select',
      options: iconNames,
    },
    disabled: { control: 'boolean' },
    shadow: { control: 'boolean' },
    onPress: { action: 'pressed' },
  },
  args: {
    icon: 'arrowLeft',
    accessibilityLabel: 'Go back',
    onPress: noop,
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}
