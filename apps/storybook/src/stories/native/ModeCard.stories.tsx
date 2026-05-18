import { ModeCard } from '@financial-app/ui/native'
import i18n from 'i18next'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: 'Native/Design System/Molecules/ModeCard',
  component: ModeCard,
  argTypes: {
    icon: {
      control: 'select',
      options: ['manual', 'bank'],
    },
    title: { control: 'text' },
    description: { control: 'text' },
    badge: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    icon: 'manual',
    title: i18n.t('onboarding.modeChoice.manualTitle'),
    description: i18n.t('onboarding.modeChoice.manualDescription'),
    onPress: noop,
  },
  decorators: [
    (Story) => (
      <View style={{ paddingTop: 40, paddingHorizontal: 16, maxWidth: 400 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ModeCard>

export default meta
type Story = StoryObj<typeof meta>

/** Interactive playground with all controls. */
export const Playground: Story = {}

/** Manual mode — active, pressable. */
export const Manual: Story = {
  args: {
    icon: 'manual',
    title: i18n.t('onboarding.modeChoice.manualTitle'),
    description: i18n.t('onboarding.modeChoice.manualDescription'),
  },
}

/** Bank mode — disabled with "Coming soon" badge. */
export const BankDisabled: Story = {
  args: {
    icon: 'bank',
    title: i18n.t('onboarding.modeChoice.bankTitle'),
    description: i18n.t('onboarding.modeChoice.bankDescription'),
    disabled: true,
    badge: i18n.t('onboarding.modeChoice.comingSoon'),
  },
}
