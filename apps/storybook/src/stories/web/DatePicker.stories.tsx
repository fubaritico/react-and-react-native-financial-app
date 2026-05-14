import { DatePicker } from '@financial-app/ui'
import { useState } from 'react'

import type { IDatePickerProps } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Web/Design System/Organisms/DatePicker',
  component: DatePicker,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    value: { table: { disable: true } },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    min: { control: 'text' },
    max: { control: 'text' },
    onChange: { action: 'changed' },
  },
  args: {
    value: null,
    onChange: noop,
    label: 'Date',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** Controlled DatePicker with state. */
function ControlledDatePicker(props: Readonly<IDatePickerProps>) {
  const [value, setValue] = useState<string | null>(props.value)
  return (
    <div style={{ width: 300 }}>
      <DatePicker {...props} value={value} onChange={setValue} />
      <p style={{ marginTop: 8, fontSize: 12, color: '#696868' }}>
        Value: {value ?? 'null'}
      </p>
    </div>
  )
}

/** DatePicker with a pre-selected date. */
export const WithValue: Story = {
  argTypes: {
    value: { table: { disable: true } },
    placeholder: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
  args: { value: '2024-07-29', label: 'Transaction date' },
  render: (args) => <ControlledDatePicker {...args} />,
}

/** DatePicker with no selection (placeholder visible). */
export const Empty: Story = {
  argTypes: {
    value: { table: { disable: true } },
    min: { table: { disable: true } },
    max: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
  args: { value: null, label: 'Start date', placeholder: 'Pick a date' },
  render: (args) => <ControlledDatePicker {...args} />,
}

/** DatePicker with min/max date constraints. */
export const WithMinMax: Story = {
  argTypes: {
    value: { table: { disable: true } },
    placeholder: { table: { disable: true } },
    helperText: { table: { disable: true } },
    error: { table: { disable: true } },
    disabled: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
  args: {
    value: '2024-07-15',
    label: 'Date (Jul 2024 only)',
    min: '2024-07-01',
    max: '2024-07-31',
  },
  render: (args) => <ControlledDatePicker {...args} />,
}

/** DatePicker in error state. */
export const WithError: Story = {
  argTypes: {
    value: { table: { disable: true } },
    min: { table: { disable: true } },
    max: { table: { disable: true } },
    placeholder: { table: { disable: true } },
    disabled: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
  args: {
    value: null,
    label: 'Date',
    error: true,
    helperText: 'Date is required',
  },
  render: (args) => <ControlledDatePicker {...args} />,
}

/** DatePicker in disabled state. */
export const Disabled: Story = {
  argTypes: {
    value: { table: { disable: true } },
    min: { table: { disable: true } },
    max: { table: { disable: true } },
    placeholder: { table: { disable: true } },
    error: { table: { disable: true } },
    helperText: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
  args: { value: '2024-07-29', label: 'Date', disabled: true },
}

/** All states side by side. */
export const Showcase: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <section>
        <h3 style={{ marginBottom: 8 }}>Default</h3>
        <div style={{ width: 300 }}>
          <ControlledDatePicker
            value={null}
            onChange={noop}
            label="Transaction date"
            placeholder="Select date"
          />
        </div>
      </section>
      <section>
        <h3 style={{ marginBottom: 8 }}>With value</h3>
        <div style={{ width: 300 }}>
          <ControlledDatePicker
            value="2024-07-29"
            onChange={noop}
            label="Transaction date"
          />
        </div>
      </section>
      <section>
        <h3 style={{ marginBottom: 8 }}>Error</h3>
        <div style={{ width: 300 }}>
          <DatePicker
            value={null}
            onChange={noop}
            label="Date"
            error={true}
            helperText="Date is required"
          />
        </div>
      </section>
      <section>
        <h3 style={{ marginBottom: 8 }}>Disabled</h3>
        <div style={{ width: 300 }}>
          <DatePicker
            value="2024-07-29"
            onChange={noop}
            label="Date"
            disabled
          />
        </div>
      </section>
    </div>
  ),
}
