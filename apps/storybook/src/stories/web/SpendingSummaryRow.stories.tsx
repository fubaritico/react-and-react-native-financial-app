import { SpendingSummaryRow } from '@financial-app/ui'
import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Web/Design System/SpendingSummaryRow',
  component: SpendingSummaryRow,
  argTypes: {
    label: { control: 'text' },
    amount: { control: 'text' },
    color: {
      control: 'select',
      options: [
        'green',
        'cyan',
        'navy',
        'yellow',
        'purple',
        'turquoise',
        'brown',
      ],
    },
  },
  args: {
    label: 'Entertainment',
    amount: '$50.00',
    color: 'green',
  },
} satisfies Meta<typeof SpendingSummaryRow>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** Budget legend as seen on the Overview page. */
export const Showcase: Story = {
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <SpendingSummaryRow label="Entertainment" amount="$50.00" color="green" />
      <SpendingSummaryRow label="Bills" amount="$750.00" color="cyan" />
      <SpendingSummaryRow label="Dining Out" amount="$75.00" color="yellow" />
      <SpendingSummaryRow label="Personal Care" amount="$100.00" color="navy" />
    </div>
  ),
}
