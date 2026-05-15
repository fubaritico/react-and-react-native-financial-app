import { iconNames } from '@financial-app/icons'
import { Button } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Web/Design System/Atoms/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'destroy', 'outline'],
    },
    size: {
      control: 'select',
      options: ['md', 'sm', 'nav'],
    },
    icon: {
      control: 'select',
      options: [undefined, ...iconNames],
    },
    centered: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
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
      <Button title="Outline" variant="outline" onPress={noop} />
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
      <Button title="Outline" variant="outline" disabled onPress={noop} />
    </div>
  ),
}

/** Loading state — spinner replaces content, button is disabled. */
export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Button title="Primary" variant="primary" loading onPress={noop} />
      <Button title="Secondary" variant="secondary" loading onPress={noop} />
      <Button title="Tertiary" variant="tertiary" loading onPress={noop} />
      <Button title="Destroy" variant="destroy" loading onPress={noop} />
      <Button title="Outline" variant="outline" loading onPress={noop} />
    </div>
  ),
}

/** Loading full-width — typical modal submit button. */
export const LoadingFullWidth: Story = {
  render: () => (
    <div
      style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      <Button
        title="Save Changes"
        variant="primary"
        loading
        fullWidth
        centered
        onPress={noop}
      />
      <Button
        title="Yes, Confirm Deletion"
        variant="destroy"
        loading
        fullWidth
        centered
        onPress={noop}
      />
    </div>
  ),
}
