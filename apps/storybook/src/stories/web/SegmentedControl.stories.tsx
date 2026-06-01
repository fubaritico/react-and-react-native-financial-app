import { SegmentedControl } from '@financial-app/ui'
import { useState } from 'react'

import type { ISegmentOption, ISegmentedControlProps } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

/** Two-segment fixture — the transaction type (expense / income) use case. */
const TYPE_SEGMENTS: ISegmentOption[] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
]

/** Three-segment fixture — a transaction list filter. */
const FILTER_SEGMENTS: ISegmentOption[] = [
  { value: 'all', label: 'All' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
]

/**
 * Stateful wrapper so the control toggles visibly in Storybook.
 * @param props - SegmentedControl props; `value` seeds the initial selection.
 * @returns A controlled SegmentedControl holding its own selection state.
 */
function StatefulSegmentedControl(props: Readonly<ISegmentedControlProps>) {
  const [value, setValue] = useState(props.value)
  return <SegmentedControl {...props} value={value} onChange={setValue} />
}

const meta = {
  title: 'Web/Design System/Molecules/SegmentedControl',
  component: SegmentedControl,
  parameters: { backgrounds: 'white' },
  argTypes: {
    label: { control: 'text' },
    accessibilityLabel: { control: 'text' },
    name: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Transaction type',
    segments: TYPE_SEGMENTS,
    value: 'expense',
    accessibilityLabel: 'Transaction type',
    name: 'txn-type',
    disabled: false,
    onChange: () => undefined,
  },
  render: (args) => <StatefulSegmentedControl {...args} />,
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** Two-segment expense / income toggle, three-segment filter, and disabled state. */
export const Showcase: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section>
        <h3 style={{ marginBottom: 8 }}>Two segments (transaction type)</h3>
        <StatefulSegmentedControl
          segments={TYPE_SEGMENTS}
          value="expense"
          accessibilityLabel="Transaction type"
          name="showcase-type"
          onChange={() => undefined}
        />
      </section>
      <section>
        <h3 style={{ marginBottom: 8 }}>Three segments (filter)</h3>
        <StatefulSegmentedControl
          segments={FILTER_SEGMENTS}
          value="all"
          accessibilityLabel="Transaction filter"
          name="showcase-filter"
          onChange={() => undefined}
        />
      </section>
      <section>
        <h3 style={{ marginBottom: 8 }}>Disabled</h3>
        <SegmentedControl
          segments={TYPE_SEGMENTS}
          value="income"
          accessibilityLabel="Transaction type"
          name="showcase-disabled"
          onChange={() => undefined}
          disabled
        />
      </section>
    </div>
  ),
}
