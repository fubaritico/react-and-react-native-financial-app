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
  title: 'Native/Design System/Atoms/DonutChart',
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

/** Without subtitle. */
export const NoSubLabel: Story = {
  args: {
    segments: [...BUDGET_SEGMENTS],
    centerLabel: '$338',
  },
}
