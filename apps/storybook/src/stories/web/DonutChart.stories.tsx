import { DonutChart } from '@financial-app/ui'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const BUDGET_SEGMENTS = [
  {
    percentage: 5.13,
    color: '#277c78',
    label: 'Entertainment: $15.00 of $50.00',
  },
  {
    percentage: 76.92,
    color: '#82c9d7',
    label: 'Bills: $150.00 of $750.00',
  },
  {
    percentage: 7.69,
    color: '#f2cdac',
    label: 'Dining Out: $133.00 of $75.00',
  },
  {
    percentage: 10.26,
    color: '#626070',
    label: 'Personal Care: $40.00 of $100.00',
  },
] as const

const meta = {
  title: 'Web/Design System/Atoms/DonutChart',
  component: DonutChart,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: { type: 'range', min: 120, max: 400, step: 10 } },
    centerLabel: { control: 'text' },
    centerSubLabel: { control: 'text' },
  },
  args: {
    segments: [...BUDGET_SEGMENTS],
    centerLabel: '$338',
    centerSubLabel: 'of $975 limit',
    size: 240,
  },
} satisfies Meta<typeof DonutChart>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** Budget donut matching the design reference. */
export const BudgetChart: Story = {
  args: {
    segments: [...BUDGET_SEGMENTS],
    centerLabel: '$338',
    centerSubLabel: 'of $975 limit',
    size: 280,
  },
}

/** Small variant for overview cards. */
export const Small: Story = {
  args: {
    segments: [...BUDGET_SEGMENTS],
    centerLabel: '$338',
    centerSubLabel: 'of $975 limit',
    size: 160,
  },
}

/** Large variant for full budgets page. */
export const Large: Story = {
  args: {
    segments: [...BUDGET_SEGMENTS],
    centerLabel: '$338',
    centerSubLabel: 'of $975 limit',
    size: 360,
  },
}

/** Single dominant segment (edge case). */
export const SingleSegment: Story = {
  args: {
    segments: [
      { percentage: 100, color: '#277c78', label: 'Only category: 100%' },
    ],
    centerLabel: '$500',
    centerSubLabel: 'of $500 limit',
  },
}

/** Two equal segments. */
export const TwoSegments: Story = {
  args: {
    segments: [
      { percentage: 50, color: '#277c78', label: 'Category A: 50%' },
      { percentage: 50, color: '#82c9d7', label: 'Category B: 50%' },
    ],
    centerLabel: '$200',
    centerSubLabel: 'of $400 limit',
  },
}

/** Without subtitle. */
export const NoSubLabel: Story = {
  args: {
    segments: [...BUDGET_SEGMENTS],
    centerLabel: '$338',
  },
}

/** All sizes side by side. */
export const Showcase: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <DonutChart
          segments={[...BUDGET_SEGMENTS]}
          centerLabel="$338"
          centerSubLabel="of $975"
          size={140}
        />
        <p style={{ marginTop: 8, fontSize: 12, color: '#696868' }}>140px</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <DonutChart
          segments={[...BUDGET_SEGMENTS]}
          centerLabel="$338"
          centerSubLabel="of $975 limit"
          size={240}
        />
        <p style={{ marginTop: 8, fontSize: 12, color: '#696868' }}>
          240px (default)
        </p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <DonutChart
          segments={[...BUDGET_SEGMENTS]}
          centerLabel="$338"
          centerSubLabel="of $975 limit"
          size={320}
        />
        <p style={{ marginTop: 8, fontSize: 12, color: '#696868' }}>320px</p>
      </div>
    </div>
  ),
}
