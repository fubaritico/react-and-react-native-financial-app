import { SegmentedControl } from '@financial-app/ui/native'
import { useState } from 'react'
import { View } from 'react-native'

import type {
  ISegmentOption,
  ISegmentedControlProps,
} from '@financial-app/ui/native'

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
  title: 'Native/Design System/Molecules/SegmentedControl',
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
  decorators: [
    (Story) => (
      <View style={{ width: 320 }}>
        <Story />
      </View>
    ),
  ],
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
    <View style={{ gap: 24, width: 320 }}>
      <StatefulSegmentedControl
        segments={TYPE_SEGMENTS}
        value="expense"
        accessibilityLabel="Transaction type"
        name="showcase-type"
        onChange={() => undefined}
      />
      <StatefulSegmentedControl
        segments={FILTER_SEGMENTS}
        value="all"
        accessibilityLabel="Transaction filter"
        name="showcase-filter"
        onChange={() => undefined}
      />
      <SegmentedControl
        segments={TYPE_SEGMENTS}
        value="income"
        accessibilityLabel="Transaction type"
        name="showcase-disabled"
        onChange={() => undefined}
        disabled
      />
    </View>
  ),
}
