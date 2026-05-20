import { PotAmountFormContent } from '@financial-app/features/native'
import { Card } from '@financial-app/ui'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Native/Features/Pots/PotAmountFormContent',
  component: PotAmountFormContent,
  parameters: { layout: 'centered' },
  argTypes: {
    mode: { control: 'select', options: ['add', 'withdraw'] },
    currentTotal: {
      control: { type: 'range', min: 0, max: 2000, step: 10 },
    },
    target: { control: { type: 'range', min: 0, max: 5000, step: 100 } },
  },
  args: {
    currentTotal: 159,
    target: 2000,
    mode: 'add',
    newAmountLabel: 'New Amount',
    targetOfLabel: 'Target of',
    amountLabel: 'Amount to Add',
    amountPlaceholder: 'e.g. 50',
  },
  decorators: [
    (Story) => (
      <View style={{ width: 450 }}>
        <Card>
          <Story />
        </Card>
      </View>
    ),
  ],
} satisfies Meta<typeof PotAmountFormContent>

export default meta
type Story = StoryObj<typeof meta>

/** Add money mode — buffer in success green, max input = target - currentTotal. */
export const AddMoney: Story = {}

/** Withdraw mode — buffer in destructive red, max input = currentTotal. */
export const Withdraw: Story = {
  args: {
    mode: 'withdraw',
    amountLabel: 'Amount to Withdraw',
  },
}

/** Pot nearly full — only $41 can be added. */
export const NearlyFull: Story = {
  args: {
    currentTotal: 1959,
    target: 2000,
    mode: 'add',
  },
}

/** Pot almost empty — only $10 can be withdrawn. */
export const AlmostEmpty: Story = {
  args: {
    currentTotal: 10,
    target: 2000,
    mode: 'withdraw',
    amountLabel: 'Amount to Withdraw',
  },
}
