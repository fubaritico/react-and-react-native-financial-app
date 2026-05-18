import { ModeCard, Typography } from '@financial-app/ui/native'
import i18n from 'i18next'
import { View } from 'react-native'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import type { ReactNode } from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

/** Token: color.black (#000000) — device bezel simulation */
const DEVICE_FRAME_BG = '#000000'
/** Token: color.beige-100 (#f8f4f0) — app background simulation */
const DEVICE_SCREEN_BG = '#f8f4f0'

/** iPhone 16 Pro screen dimensions */
const IPHONE_WIDTH = 393
const IPHONE_HEIGHT = 852

/** Pixel 9 screen dimensions */
const ANDROID_WIDTH = 412
const ANDROID_HEIGHT = 915

/**
 * Device frame wrapper — dark background with a beige rounded screen.
 * @param props - Frame dimensions and children
 * @returns A simulated device frame
 */
const DeviceFrame = ({
  width,
  height,
  children,
}: {
  /** Frame width in pixels */
  width: number
  /** Frame height in pixels */
  height: number
  /** Screen content */
  children: ReactNode
}) => (
  <View
    style={{
      backgroundColor: DEVICE_FRAME_BG,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <View
      style={{
        width,
        height,
        backgroundColor: DEVICE_SCREEN_BG,
        borderRadius: 20,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {children}
    </View>
  </View>
)

/**
 * Mode choice cards as displayed in the onboarding flow.
 * @returns Title + Manual card + Bank card (disabled)
 */
const ModeChoiceContent = () => (
  <View style={{ width: '100%', paddingTop: 32 }}>
    <Typography variant="heading-lg" align="center">
      {i18n.t('onboarding.modeChoice.title')}
    </Typography>
    <View style={{ marginTop: 24, gap: 8 }}>
      <ModeCard
        icon="manual"
        title={i18n.t('onboarding.modeChoice.manualTitle')}
        description={i18n.t('onboarding.modeChoice.manualDescription')}
        onPress={noop}
      />
      <ModeCard
        icon="bank"
        title={i18n.t('onboarding.modeChoice.bankTitle')}
        description={i18n.t('onboarding.modeChoice.bankDescription')}
        disabled
        badge={i18n.t('onboarding.modeChoice.comingSoon')}
        onPress={noop}
      />
    </View>
  </View>
)

const meta = {
  title: 'Native/Screens/ModeChoiceScreen',
  component: ModeCard,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    icon: 'manual',
    title: '',
    description: '',
    onPress: noop,
  },
} satisfies Meta<typeof ModeCard>

export default meta
type Story = StoryObj<typeof meta>

/** iPhone 16 Pro — mode choice screen. */
export const IPhone: Story = {
  parameters: { backgrounds: 'dark' },
  render: () => (
    <DeviceFrame width={IPHONE_WIDTH} height={IPHONE_HEIGHT}>
      <ModeChoiceContent />
    </DeviceFrame>
  ),
}

/** Pixel 9 — mode choice screen. */
export const Android: Story = {
  parameters: { backgrounds: 'dark' },
  render: () => (
    <DeviceFrame width={ANDROID_WIDTH} height={ANDROID_HEIGHT}>
      <ModeChoiceContent />
    </DeviceFrame>
  ),
}
