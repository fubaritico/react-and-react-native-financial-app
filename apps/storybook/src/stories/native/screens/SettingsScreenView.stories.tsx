import { SettingsScreenView } from '@financial-app/features/native'
import { View } from 'react-native'

import type { ISettingsScreenViewProps } from '@financial-app/features'

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
        overflow: 'hidden',
      }}
    >
      {children}
    </View>
  </View>
)

const defaultProps: ISettingsScreenViewProps = {
  initialBalance: 40000,
  currentLanguage: 'en',
  currentCurrency: 'USD',
  onSubmit: noop,
  isSubmitting: false,
  onDeleteAccount: noop,
  isDeleting: false,
  onDisconnect: noop,
  onGoBack: noop,
}

const meta = {
  title: 'Native/Screens/SettingsScreenView',
  component: SettingsScreenView,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj

/** iPhone 16 Pro — settings screen (English). */
export const IPhoneEN: Story = {
  parameters: { backgrounds: 'dark' },
  render: () => (
    <DeviceFrame width={IPHONE_WIDTH} height={IPHONE_HEIGHT}>
      <SettingsScreenView {...defaultProps} currentLanguage="en" />
    </DeviceFrame>
  ),
}

/** iPhone 16 Pro — settings screen (French). */
export const IPhoneFR: Story = {
  parameters: { backgrounds: 'dark' },
  render: () => (
    <DeviceFrame width={IPHONE_WIDTH} height={IPHONE_HEIGHT}>
      <SettingsScreenView {...defaultProps} currentLanguage="fr" />
    </DeviceFrame>
  ),
}

/** iPhone 16 Pro — settings screen while deleting account. */
export const IPhoneDeleting: Story = {
  parameters: { backgrounds: 'dark' },
  render: () => (
    <DeviceFrame width={IPHONE_WIDTH} height={IPHONE_HEIGHT}>
      <SettingsScreenView {...defaultProps} isDeleting />
    </DeviceFrame>
  ),
}

/** Pixel 9 — settings screen (English). */
export const Android: Story = {
  parameters: { backgrounds: 'dark' },
  render: () => (
    <DeviceFrame width={ANDROID_WIDTH} height={ANDROID_HEIGHT}>
      <SettingsScreenView {...defaultProps} currentLanguage="en" />
    </DeviceFrame>
  ),
}
