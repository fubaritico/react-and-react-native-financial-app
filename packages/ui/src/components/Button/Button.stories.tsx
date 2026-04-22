import { iconNames } from '@financial-app/icons'
import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

import { Button } from './Button.web'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'destroy'],
    },
    icon: {
      control: 'select',
      options: [undefined, ...iconNames],
    },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    title: { control: 'text' },
    onPress: { action: 'pressed' },
  },
  args: {
    title: 'Button',
    onPress: noop,
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** All 4 variants side by side. */
export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Button title="Primary" variant="primary" onPress={noop} />
      <Button title="Secondary" variant="secondary" onPress={noop} />
      <Button
        title="Tertiary"
        variant="tertiary"
        onPress={noop}
        icon="caretRight"
      />
      <Button title="Destroy" variant="destroy" onPress={noop} />
    </div>
  ),
}

/** Full-width variant for auth forms. */
export const FullWidth: Story = {
  args: { fullWidth: true },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
}

/** Disabled state. */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Button title="Primary" variant="primary" disabled onPress={noop} />
      <Button title="Secondary" variant="secondary" disabled onPress={noop} />
      <Button title="Tertiary" variant="tertiary" disabled onPress={noop} />
      <Button title="Destroy" variant="destroy" disabled onPress={noop} />
    </div>
  ),
}
