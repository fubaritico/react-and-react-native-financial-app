import { iconNames } from '@financial-app/icons'
import { IconButton } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Web/Design System/Atoms/IconButton',
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

/** All 4 variants side by side. */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <IconButton
        icon="arrowLeft"
        variant="primary"
        onPress={noop}
        accessibilityLabel="Primary"
      />
      <IconButton
        icon="arrowLeft"
        variant="secondary"
        onPress={noop}
        accessibilityLabel="Secondary"
      />
      <IconButton
        icon="arrowLeft"
        variant="ghost"
        onPress={noop}
        accessibilityLabel="Ghost"
      />
      <IconButton
        icon="cross"
        variant="destroy"
        onPress={noop}
        accessibilityLabel="Destroy"
      />
    </div>
  ),
}

/** All 3 sizes. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <IconButton
        icon="arrowLeft"
        size="sm"
        variant="secondary"
        onPress={noop}
        accessibilityLabel="Small"
      />
      <IconButton
        icon="arrowLeft"
        size="md"
        variant="secondary"
        onPress={noop}
        accessibilityLabel="Medium"
      />
      <IconButton
        icon="arrowLeft"
        size="lg"
        variant="secondary"
        onPress={noop}
        accessibilityLabel="Large"
      />
    </div>
  ),
}

/** Disabled state. */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <IconButton
        icon="arrowLeft"
        variant="primary"
        disabled
        onPress={noop}
        accessibilityLabel="Primary disabled"
      />
      <IconButton
        icon="arrowLeft"
        variant="secondary"
        disabled
        onPress={noop}
        accessibilityLabel="Secondary disabled"
      />
      <IconButton
        icon="cross"
        variant="destroy"
        disabled
        onPress={noop}
        accessibilityLabel="Destroy disabled"
      />
    </div>
  ),
}

/** With shadow — typical back button style. */
export const WithShadow: Story = {
  render: () => (
    <div
      style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 16 }}
    >
      <IconButton
        icon="arrowLeft"
        variant="secondary"
        shadow
        onPress={noop}
        accessibilityLabel="Back with shadow"
      />
    </div>
  ),
}
