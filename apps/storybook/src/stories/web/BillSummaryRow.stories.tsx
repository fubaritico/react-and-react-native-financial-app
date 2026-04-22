import { BillSummaryRow } from '@financial-app/ui'
import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Web/Design System/BillSummaryRow',
  component: BillSummaryRow,
  argTypes: {
    label: { control: 'text' },
    amount: { control: 'text' },
    color: {
      control: 'select',
      options: ['green', 'yellow', 'cyan'],
    },
  },
  args: {
    label: 'Paid Bills',
    amount: '$190.00',
    color: 'green',
  },
} satisfies Meta<typeof BillSummaryRow>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** All 3 recurring bill statuses as seen on the Overview page. */
export const Showcase: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 400,
      }}
    >
      <BillSummaryRow label="Paid Bills" amount="$190.00" color="green" />
      <BillSummaryRow label="Total Upcoming" amount="$194.98" color="yellow" />
      <BillSummaryRow label="Due Soon" amount="$59.98" color="cyan" />
    </div>
  ),
}
