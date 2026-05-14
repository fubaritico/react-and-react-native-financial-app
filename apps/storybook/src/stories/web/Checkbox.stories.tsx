import { Checkbox } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Web/Design System/Atoms/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md'] },
    label: { control: 'text' },
    error: { control: 'text' },
    accessibilityLabel: { control: 'text' },
    onChange: { action: 'changed' },
  },
  args: {
    checked: false,
    onChange: noop,
  },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** All states side by side. */
export const Showcase: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section>
        <h3 style={{ marginBottom: 8 }}>States</h3>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <Checkbox checked={false} onChange={noop} label="Unchecked" />
          <Checkbox checked={true} onChange={noop} label="Checked" />
          <Checkbox
            checked={false}
            onChange={noop}
            label="Indeterminate"
            indeterminate
          />
        </div>
      </section>
      <section>
        <h3 style={{ marginBottom: 8 }}>Sizes</h3>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <Checkbox checked={true} onChange={noop} label="Small" size="sm" />
          <Checkbox checked={true} onChange={noop} label="Medium" size="md" />
        </div>
      </section>
      <section>
        <h3 style={{ marginBottom: 8 }}>Disabled</h3>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <Checkbox
            checked={false}
            onChange={noop}
            label="Unchecked"
            disabled
          />
          <Checkbox checked={true} onChange={noop} label="Checked" disabled />
        </div>
      </section>
      <section>
        <h3 style={{ marginBottom: 8 }}>Error</h3>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <Checkbox
            checked={false}
            onChange={noop}
            label="Accept terms"
            error="This field is required"
          />
          <Checkbox
            checked={true}
            onChange={noop}
            label="Accept terms"
            error="Invalid selection"
          />
        </div>
      </section>
      <section>
        <h3 style={{ marginBottom: 8 }}>No label</h3>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <Checkbox
            checked={false}
            onChange={noop}
            accessibilityLabel="Toggle option"
          />
          <Checkbox
            checked={true}
            onChange={noop}
            accessibilityLabel="Toggle option"
          />
        </div>
      </section>
    </div>
  ),
}
